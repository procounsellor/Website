import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled'],
          'firebase-vendor': ['firebase'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'recharts', 'react-icons'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    }
  }
})


