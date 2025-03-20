import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin, type TransformResult } from 'vite';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcss from 'postcss';

/**
 * Interface defining the mapping between output paths and actual file paths
 */
interface CssFileMap {
  [outputPath: string]: string;
}

/**
 * Recursively searches a directory for CSS files and returns an object mapping output paths to actual file paths.
 * 
 * @param {string} dir - The directory to search for CSS files
 * @param {string} [basePath=''] - Base path for constructing relative output paths
 * @param {CssFileMap} [result={}] - Accumulator object for storing results during recursion
 * @returns {CssFileMap} An object where keys are output paths (without .css extension) and values are full file paths
 */
function findCssFiles(dir: string, basePath: string = '', result: CssFileMap = {}): CssFileMap {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 디렉토리면 재귀적으로 탐색
      findCssFiles(filePath, path.join(basePath, file), result);
    } else if (file.endsWith('.css')) {
      // CSS 파일이면 결과에 추가
      const outputPath = path.join(basePath, file.replace('.css', ''));
      result[outputPath] = filePath;
    } else if (file.endsWith('.postcss')) {
      // PostCSS 파일이면 결과에 추가 (.css로 출력될 것임)
      const outputPath = path.join(basePath, file.replace('.postcss', ''));
      result[outputPath] = filePath;
    }
  }

  return result;
}

// src 디렉토리의 모든 CSS 파일 찾기
const cssFiles: CssFileMap = findCssFiles(resolve(__dirname, 'src'));

// 각 CSS 파일을 input으로 추가
const input: Record<string, string> = {
  'index': resolve(__dirname, 'src/index.css'),
};

// 모든 CSS 파일을 input에 추가
for (const [outputPath, filePath] of Object.entries(cssFiles)) {
  input[outputPath] = filePath;
}

function cssProcessorPlugin(): Plugin {
  // 일반 CSS용 PostCSS 프로세서
  const standardProcessor = postcss([postcssImport()]);

  // .postcss 파일용 PostCSS 프로세서
  const tailwindProcessor = postcss([
    postcssImport(),
    autoprefixer(),
    tailwindcss(),
  ]);

  return {
    name: 'css-processor-plugin',

    async transform(code, id): Promise<TransformResult | null> {
      // CSS 또는 PostCSS 파일인지 확인
      if (id.endsWith('.css') || id.endsWith('.postcss')) {
        // .postcss 파일일 경우 TailwindCSS 등을 적용
        if (id.endsWith('.postcss')) {
          const result = await tailwindProcessor.process(code, {
            from: id,
            to: id.replace('.postcss', '.css')
          });

          return {
            code: result.css,
            map: null, // XXX css sourcemap 지원 안함
          };
        }

        // .css 파일인 경우 최소한의 처리만 수행 (import 처리만)
        if (id.endsWith('.css')) {
          const result = await standardProcessor.process(code, {
            from: id,
            to: id
          });

          return {
            code: result.css,
            map: null, // XXX css sourcemap 지원 안함
          };
        }
      }

      return null;
    }
  };
}

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        assetFileNames: (assetInfo) => {
          // 원래 파일 경로를 유지
          const name = assetInfo.name || '';
          const extType = name.split('.').at(-1);
          if (extType === 'css') {
            return name;
            // return `${name}.css`;
          }
          return `assets/${name}.${extType}`;
        },
      },
    },
  },
  plugins: [
    cssProcessorPlugin(),
  ],
});
