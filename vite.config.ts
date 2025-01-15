import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      '/b2api': {
        target: 'https://awx.pro',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})

// https://awx.pro/b2api/change/user/pair/calc