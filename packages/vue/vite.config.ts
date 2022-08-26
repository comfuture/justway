import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import libCss from 'vite-plugin-libcss'

// https://vitejs.dev/config/
export default defineConfig({
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
