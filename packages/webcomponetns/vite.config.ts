import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'justway web components',
      fileName: (format) => `lib.${format}.js`,
    },
    rollupOptions: {
      external: ['lit-html', 'lit-element'],
    }
  },
  plugins: [
  ]
})
