import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export async function generateArtwork() {
  const destination = new URL('../react-site/.generated/', import.meta.url);
  await mkdir(destination, { recursive: true });
  for (const id of ['redactory', 'divination', 'bloom']) {
    await sharp(fileURLToPath(new URL(`../src/assets/uploads/systems/sys-${id}-panel.png`, import.meta.url)))
      .resize({ width: 1100, height: 1300, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fileURLToPath(new URL(`${id}.webp`, destination)));
  }
}
