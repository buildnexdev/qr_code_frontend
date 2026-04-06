import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Matches QR codes generated in qr-admin Tables (`localhost:5174`)
    port: 5174,
    strictPort: false,
  },
})
