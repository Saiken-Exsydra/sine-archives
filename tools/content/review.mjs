import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { publicationId } from '../../src/content/character-publication.ts';

const host = '127.0.0.1';
const port = 5176;

try {
  const [directory, character, ...extra] = process.argv.slice(2);
  if (!directory || !publicationId.test(character ?? '') || extra.length) {
    throw new Error('Usage: npm run review -- "<private site directory>" <character-id>');
  }

  const checkout = realpathSync(fileURLToPath(new URL('../../', import.meta.url)));
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
    if (!Array.isArray(record.dossier) || record.dossier.length === 0) {
      throw new Error(`Attach a Complete Dossier before reviewing ${entry.name}.`);
    }
  }

  const build = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
    cwd: root,
    stdio: 'inherit',
  });
  if (build.error) throw build.error;
  if (build.status !== 0) throw new Error('The private site failed its build. No preview was started.');

  await preview({ root, configFile: false, appType: 'mpa', preview: { host, port, strictPort: true } });
  console.log(`Character review: http://${host}:${port}/?lang=en#/characters/${character}`);
  console.log('Leave this process running during review. Stop it when the review is complete.');
} catch (error) {
  console.error(`Character review: ${error.message}`);
  process.exitCode = 1;
}
