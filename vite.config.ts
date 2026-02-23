import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
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
            if (id.includes('supabase')) return 'vendor-supabase';
            return 'vendor'; // all other libs
          }
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
