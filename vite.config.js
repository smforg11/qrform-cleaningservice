import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzwvSrKaCPw1kvD0ENwUpuGzLZRULOvJAxHVK7uoDN3UMQtavFasHfuaUgiU0FZebnj-w/exec'
const n8n_URL =
  'https://n8n.sarana.id'

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
      "/api-n8n": {
        target: n8n_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api-n8n/, "/webhook/9bfbf73a-5c39-47f9-85c4-ba5f4bb2ee0c"),
      },
    },
  },
   rollupOptions: {
      external: ["@zxing/library"],
    },
})
