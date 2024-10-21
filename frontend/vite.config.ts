import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3300/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/public': {
        target: 'http://127.0.0.1:3300/public',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/public/, ''),
      },
      '/bucket1': {
        target: 'http://127.0.0.1:9000/bucket1',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/bucket1/, ''),
      },
    },
  },
})
