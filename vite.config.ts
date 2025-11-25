import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['ogl'],
  },
  build: {
    target: 'esnext',
  },
  // Fix for "TypeError: t._onTimeout is not a function" and other global issues
  define: {
    global: 'window',
  },
});
