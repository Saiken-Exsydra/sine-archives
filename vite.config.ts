import { defineConfig } from 'vite';
import { characterReviewPlugin } from './tools/content/review-preview.mjs';
import { localServer, localStatusPlugin } from './tools/local-server.mjs';

export default defineConfig({
  plugins: [localStatusPlugin(), characterReviewPlugin()],
  esbuild: { jsx: 'automatic' },
  resolve: { preserveSymlinks: true },
  build: { rollupOptions: { preserveSymlinks: true } },
  server: { ...localServer, fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**',
    '**/.asset-sources.local.json', '**/.character-sources.local.json', '**/.asset-pipeline/**'] } },
});
