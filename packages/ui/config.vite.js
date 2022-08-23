import glob from 'glob'
import path from "path";
import { defineConfig } from "vite";

module.exports = defineConfig(async () => {

  const input = await new Promise((resolve, reject) => {
    const input = {}
    glob("src/style/**/*.css", { debug: true }, async (error, files) => {
      for (const file of files) {
        const filename = path.basename(file, '.css')
        input[filename] = path.resolve(__dirname, 'src/style', `${filename}.css`)
      }
      resolve(input)
    })
  })

  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/main.ts"),
        name: "@justway/ui",
      },
      exports: {
        "./theme/*.css": "./dist/theme/*.css",
        "./theme/*": "./dist/theme/*.js",
        "./*.css": "./dist/*.css",
        "./*": "./dist/*.js"
      },
      rollupOptions: {
        input,
        output: {
          entryFileNames: () => '[name].css',
        }
      },
    }
  }
});
