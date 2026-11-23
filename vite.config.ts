import { defineConfig } from 'vite';

const localServer = { host: 'localhost', port: 5174, strictPort: true };

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: { preserveSymlinks: true },
  build: { rollupOptions: { preserveSymlinks: true } },
  server: localServer,
  preview: localServer,
});
