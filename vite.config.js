import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const proxy = {
  '/api': {
    target: 'http://api.favorit-parts.ru',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: { proxy },
  preview: { proxy },
});
