import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'framer-motion'
          if (id.includes('node_modules/@supabase')) return 'supabase'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor'
          if (id.includes('src/admin/')) return 'admin'
        },
      },
    },
  },
  server: {
    port: 2014,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
