import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import libCss from 'vite-plugin-libcss'
import postcssImport from 'postcss-import';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssImport(),
      ],
    },
  },
  plugins: [libCss(), vue()],
  build: {
    // minify: false,
    lib: {
      entry: 'src/index.ts',
      name: 'justway vue components',
      fileName: (format) => `lib.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
    }
  }
})
