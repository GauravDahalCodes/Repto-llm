import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Repto-Ilm/', // Add this line
  server: {
    port: 3000 // Optional: specify a port
  }
})