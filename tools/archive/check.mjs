import { readFile } from 'node:fs/promises';
import { publicationId } from '../../src/content/character-publication.ts';
import { readCharacterPublication } from '../content/characters.mjs';
import { checkDossierSources, loadLocalEnvironment, readSourceMap, verifyArtworkSources } from './sources.mjs';
import { overviewEvidence } from './overview-evidence.mjs';

try {
  loadLocalEnvironment();
  const args = process.argv.slice(2);
  const evidence = args[0] === '--overview';
  const requested = [...new Set(evidence ? args.slice(1) : args)];
  if (evidence && !requested.length) throw new Error('Pass at least one exact character ID after --overview.');
  if (requested.some(id => !publicationId.test(id))) {
    throw new Error('Pass exact lowercase character IDs, or omit IDs to check all published characters and artwork.');
  }
  const characters = requested.length ? requested : (await readCharacterPublication()).characters.map(({ id }) => id);
  let revisions;
  try {
    revisions = await checkDossierSources({
      characters, characterSources: await readSourceMap('.character-sources.local.json'),
      inspect: evidence ? overviewEvidence : undefined,
    });
  } catch (error) {
    revisions = characters.map(id => ({ id, status: 'unavailable', reason: error.message }));
  }
  if (evidence) process.stdout.write(JSON.stringify(revisions, null, 2) + '\n');
  else for (const { id, sha256, status, reason } of revisions) {
    console.log(`${id}: ${status} (${sha256 ?? reason})`);
  }
  const unavailable = revisions.some(({ status }) => status === 'unavailable');
  const pending = revisions.some(({ status }) => status === 'changed' || status === 'unreviewed');
  process.exitCode = unavailable ? 1 : pending ? 2 : 0;

  if (!requested.length) {
    const artwork = JSON.parse(await readFile(new URL('../assets/approved.json', import.meta.url), 'utf8'));
    await verifyArtworkSources({ artwork: artwork.map(({ id }) => id), assetSources: await readSourceMap('.asset-sources.local.json') });
    console.log(`Resolved ${artwork.length} artwork sources. Use assets:dry-run to verify their approved bytes.`);
  }
} catch (error) {
  console.error('SiNE Archive:', error.message);
  process.exitCode = 1;
}
