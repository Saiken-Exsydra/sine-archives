import { defineConfig } from 'vite';

export default defineConfig({
  // Vite's existing JSX compiler is sufficient; no React plugin is added.
  esbuild: { jsx: 'automatic' },
  resolve: { preserveSymlinks: true },
  publicDir: false,
  build: { outDir: '../dist-react', emptyOutDir: true, rollupOptions: { preserveSymlinks: true } },
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1', port: 4174, strictPort: true },
});
