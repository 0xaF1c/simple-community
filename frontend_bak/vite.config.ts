import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3300/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/public': {
        target: 'http://127.0.0.1:3300/public',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, '')
      },
      '/storage': {
        target: 'http://127.0.0.1:3300/storage',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storage/, '')
      }
    }
  }
})
