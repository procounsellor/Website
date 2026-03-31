import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.ANALYZE === 'true'
      ? [visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'dist/stats.html' })]
      : []),
  ],
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }

          if (
            id.includes('@mui') ||
            id.includes('@emotion') ||
            id.includes('@radix-ui') ||
            id.includes('@headlessui') ||
            id.includes('framer-motion') ||
            id.includes('lucide-react')
          ) {
            return 'ui-vendor';
          }

          if (
            id.includes('@tanstack') ||
            id.includes('zustand') ||
            id.includes('axios')
          ) {
            return 'data-vendor';
          }

          if (id.includes('firebase')) {
            return 'firebase-vendor';
          }

          if (
            id.includes('recharts') ||
            id.includes('tsparticles')
          ) {
            return 'media-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})


