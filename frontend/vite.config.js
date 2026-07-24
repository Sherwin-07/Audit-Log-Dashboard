import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Frontend calls /api/* directly; Vite proxies it to Express in dev.
      '/api': 'http://localhost:5001',
    },
  },
});
