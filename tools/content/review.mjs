import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicationId } from '../../src/content/character-publication.ts';
import { reviewDirectory, reviewMarker, reviewPath } from './review-preview.mjs';

const checkout = realpathSync(fileURLToPath(new URL('../../', import.meta.url)));
const staging = reviewDirectory(checkout);

async function main([directory, character, ...extra]) {
  const active = path.join(staging, reviewMarker);
  if (directory === '--clear' && !character) {
    await rm(active, { force: true });
    console.log('Character review cleared.');
    return;
  }
  if (!directory || !publicationId.test(character ?? '') || extra.length) {
    throw new Error('Usage: npm run review -- "<private site directory>" <character-id> or npm run review -- --clear');
  }

  const root = realpathSync(directory);
  const relative = path.relative(checkout, root);
  const outsideCheckout = path.isAbsolute(relative) || relative.startsWith(`..${path.sep}`);
  if (!outsideCheckout || existsSync(path.join(root, '.git'))) {
    throw new Error('Use a private exported site outside the React checkout and separate from Git.');
  }
  const characterDirectory = ['src', 'content', 'characters'];
  const collection = path.join(root, ...characterDirectory);
  if (!existsSync(path.join(collection, character, 'record.json'))) {
    throw new Error(`The private site has no character record for ${character}.`);
  }
  for (const entry of readdirSync(collection, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const ordinaryRecord = path.join(checkout, ...characterDirectory, entry.name, 'record.json');
    if (entry.name !== character && existsSync(ordinaryRecord)) continue;
    const record = JSON.parse(readFileSync(path.join(collection, entry.name, 'record.json'), 'utf8'));
    if (!Array.isArray(record.dossier) || record.dossier.length !== 1 || record.dossier[0] !== 'en') {
      throw new Error(`Attach the English Complete Dossier before reviewing ${entry.name}.`);
    }
  }

  await mkdir(staging, { recursive: true, mode: 0o700 });
  const output = await mkdtemp(path.join(staging, 'build-'));
  const build = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build', '--',
    '--base', reviewPath, '--outDir', output], {
    cwd: root,
    stdio: 'inherit',
  });
  if (build.error) throw build.error;
  if (build.status !== 0 || !existsSync(path.join(output, 'index.html'))) {
    throw new Error('The private site failed its build. The active review was left in place.');
  }

  // Switch the active review only after the full build finishes.
  const marker = path.join(output, reviewMarker);
  await writeFile(marker, path.basename(output));
  await rename(marker, active);
  console.log(`Character review: http://localhost:5174${reviewPath}?lang=en#/characters/${character}`);
}

main(process.argv.slice(2)).catch(error => {
  console.error(`Character review: ${error.message}`);
  process.exitCode = 1;
});
