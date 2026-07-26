import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lucide')) return 'vendor-icons';
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('recharts')) return 'vendor-viz';
            if (id.includes('turso')) return 'vendor-turso';
            return 'vendor'; // all other libs
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8788',
      '/chat-luna': 'http://localhost:8788',
      '/github-contributions': 'http://localhost:8788',
      '/admin-login': 'http://localhost:8788',
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
