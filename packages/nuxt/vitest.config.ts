import { defineConfig } from 'vitest/config'
import postcssImport from 'postcss-import'
// import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // plugins: [
  //   vue(),
  // ],
  css: {
    postcss: {
      plugins: [
        postcssImport(),
      ],
    },
  },
})
