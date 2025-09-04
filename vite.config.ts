import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api/msg91': {
          target: env.VITE_MSG91_API_URL || 'https://control.msg91.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/msg91/, '/api/v5'),
          secure: true
        }
      }
    }
  }
})
