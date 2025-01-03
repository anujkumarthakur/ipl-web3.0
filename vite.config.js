import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow connections from Render's external network
    port: process.env.PORT || 5173, // Use the port provided by Render or fallback to 5173
  },
})
