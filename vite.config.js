import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for Electron to load assets correctly
  build: {
    outDir: 'dist', // Output directory for web assets
  },
  // Ensure that Electron's main process can load the bundled renderer
  server: {
    port: 3000, // Or any port you prefer for the dev server
  },
})
