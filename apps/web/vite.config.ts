import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      // '@' maps to 'src/' so we write:
      //   import { cn } from '@/shared/lib/utils'
      // instead of:
      //   import { cn } from '../../../shared/lib/utils'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      // Requests to /api/... are forwarded to Spring Boot
      // This avoids CORS errors during local development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split vendor code into separate chunks for better browser caching
        // Users only re-download React when React itself changes, not on every deploy
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
