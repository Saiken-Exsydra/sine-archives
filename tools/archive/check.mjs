import { readFile } from 'node:fs/promises';
import { publicationId } from '../../src/content/character-publication.ts';
import { readCharacterPublication } from '../content/characters.mjs';
import { checkDossierSources, loadLocalEnvironment, verifyArtworkSources } from './sources.mjs';

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
  const requested = [...new Set(process.argv.slice(2))];
  if (requested.some(id => !publicationId.test(id))) {
    throw new Error('Pass exact lowercase character IDs, or omit IDs to check all published characters and artwork.');
  }
  const characters = requested.length ? requested : (await readCharacterPublication()).characters.map(({ id }) => id);
  let revisions;
  try {
    revisions = await checkDossierSources({ characters, characterSources: await readMap('.character-sources.local.json') });
  } catch (error) {
    revisions = characters.map(id => ({ id, status: 'unavailable', reason: error.message }));
  }
  for (const { id, sha256, status, reason } of revisions) {
    console.log(`${id}: ${status} (${sha256 ?? reason})`);
  }
  const unavailable = revisions.some(({ status }) => status === 'unavailable');
  const pending = revisions.some(({ status }) => status === 'changed' || status === 'unreviewed');
  process.exitCode = unavailable ? 1 : pending ? 2 : 0;

  if (!requested.length) {
    const artwork = JSON.parse(await readFile(new URL('../assets/approved.json', import.meta.url), 'utf8'));
    await verifyArtworkSources({ artwork: artwork.map(({ id }) => id), assetSources: await readMap('.asset-sources.local.json') });
    console.log(`Resolved ${artwork.length} artwork sources. Use assets:dry-run to verify their approved bytes.`);
  }
} catch (error) {
  console.error('SiNE Archive:', error.message);
  process.exitCode = 1;
}
