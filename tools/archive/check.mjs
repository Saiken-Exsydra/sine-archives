import { readFile } from 'node:fs/promises';
import { readCharacterPublication } from '../content/characters.mjs';
import { loadLocalEnvironment, verifyArchive } from './sources.mjs';

async function readMap(file) {
  let raw;
  try { raw = await readFile(file, 'utf8'); }
  catch (error) { throw new Error(`${file}: Could not read mapping (${error.code})`); }
  let map;
  try { map = JSON.parse(raw.replace(/^\uFEFF/, '')); }
  catch { throw new Error(`${file}: Invalid JSON`); }
  if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error(`${file}: Expected a JSON object`);
  return map;
}

try {
  loadLocalEnvironment();
  const { characters } = await readCharacterPublication();
  const artwork = JSON.parse(await readFile(new URL('../assets/approved.json', import.meta.url), 'utf8'));
  const revisions = await verifyArchive({
    characters: characters.map(({ id }) => id),
    artwork: artwork.map(({ id }) => id),
    characterSources: await readMap('.character-sources.local.json'),
    assetSources: await readMap('.asset-sources.local.json'),
  });
  console.log(`Resolved ${revisions.length} dossiers and ${artwork.length} artwork sources.`);
  for (const { id, sha256, status } of revisions) {
    console.log(`${id}: ${status} (${sha256})`);
  }
  if (revisions.some(({ status }) => status !== 'reviewed')) {
    console.error('Review changed or unreviewed dossier revisions before publishing updates.');
    process.exitCode = 2;
  }
} catch (error) {
  console.error('SiNE Archive:', error.message);
  process.exitCode = 1;
}
