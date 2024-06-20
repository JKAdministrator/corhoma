import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), 'module:@preact/signals-react-transform'],
  server: {
    port: 10180,
    hmr: {
      host: 'https://172.16.0.5',
    }
  }
})
