import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'os'

function getLocalIP() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(net.address)
        return net.address
      }
    }
  }
}

const IP = getLocalIP()

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const host = req.headers.host.split(':')[0]
            options.target = `http://${host}:5000`
          })
        },
      },
      '/tmp': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    },

  },

  build: {
    emptyOutDir: true,
    outDir: '../backend/dist',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'index.js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
})
