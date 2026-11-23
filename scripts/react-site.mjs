import { fileURLToPath } from 'node:url';
import { build, createServer, preview } from 'vite';
import { generateArtwork } from './react-artwork.mjs';

// Vite 6.4.2 is already pinned in the repository lockfile through Astro.
// The new site's runtime contains React and GSAP; Astro is not booted here.
const root = fileURLToPath(new URL('../react-site/', import.meta.url));
const config = { root, configFile: fileURLToPath(new URL('../react-site/vite.config.ts', import.meta.url)) };
const mode = process.argv[2] ?? 'dev';
if (mode === 'build') {
  await generateArtwork();
  await build(config);
} else if (mode === 'preview') {
  const server = await preview(config);
  server.printUrls();
} else if (mode === 'dev') {
  await generateArtwork();
  const server = await createServer(config);
  await server.listen();
  server.printUrls();
} else {
  throw new Error(`Unknown React site command: ${mode}`);
}
