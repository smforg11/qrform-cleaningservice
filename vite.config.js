import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyehbJwCkv9ABijG35OPWB3mPiVlBgzxZaTOOqaV__rYHNtVU2GYXY7EGhfIGNDMzLcaw/exec'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['qrform.smfenterprise.com', 'www.qrform.smfenterprise.com'],
    proxy: {
      '/api': {
        target: SCRIPT_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
