import { lstat, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicationId } from '../../src/content/character-publication.ts';
import { readCharacterPublication } from '../content/characters.mjs';
import { checkDossierSources, inside, loadLocalEnvironment, readSourceMap } from './sources.mjs';

const checkout = await realpath(fileURLToPath(new URL('../../', import.meta.url)));
const collection = path.join('src', 'content', 'characters');
const dossierName = 'dossier.en.md';

async function optionalStat(file) {
  return lstat(file).catch(error => {
    if (error.code !== 'ENOENT') throw error;
  });
}

async function readRegularFile(file) {
  const info = await optionalStat(file);
  if (!info) return;
  if (!info.isFile() || info.nlink !== 1) throw new Error(`${file}: Expected a regular file`);
  return readFile(file);
}

async function audit(revisions) {
  let result = 0;
  for (const { id, bytes, sha256, reason } of revisions) {
    if (!bytes) {
      console.log(`${id}: unavailable (${reason})`);
      result = 1;
      continue;
    }
    const edition = await readRegularFile(path.join(checkout, collection, id, dossierName));
    const matches = edition?.equals(bytes);
    const label = !edition ? 'no published English dossier' : matches ? 'exact copy' : 'different text';
    console.log(`${id}: ${label} (Archive SHA-256 ${sha256})`);
    if (!matches && result === 0) result = 2;
  }
  return result;
}

async function stage(review, revisions) {
  const site = await realpath(review);
  const archive = await realpath(process.env.SINE_ARCHIVE_ROOT);
  const overlaps = root => site === root || inside(root, site) || inside(site, root);
  if (overlaps(checkout) || overlaps(archive) || await optionalStat(path.join(site, '.git'))) {
    throw new Error('Use a private exported review site outside the React checkout and the Archive.');
  }

  const candidates = [];
  for (const { id, bytes, sha256, reason } of revisions) {
    if (!bytes) throw new Error(`${id}: Source unavailable (${reason})`);
    const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (!source.trim()) throw new Error(`${id}: Archive dossier is empty`);
    const folder = await realpath(path.join(site, collection, id));
    if (!inside(site, folder)) throw new Error(`${id}: Character directory resolves outside the review site`);
    const recordFile = path.join(folder, 'record.json');
    const recordBytes = await readRegularFile(recordFile);
    if (!recordBytes) throw new Error(`${id}: Missing review record`);
    const record = JSON.parse(recordBytes.toString('utf8'));
    const { dossier } = record;
    if (dossier !== undefined && (!Array.isArray(dossier) || dossier.length !== 1 || dossier[0] !== 'en')) {
      throw new Error(`${id}: Declare only the English dossier in record.json`);
    }
    const file = path.join(folder, dossierName);
    const previous = await readRegularFile(file);
    candidates.push({ id, bytes, sha256, file, previous, recordFile, record });
  }
  for (const { id, bytes, sha256, file, previous, recordFile, record } of candidates) {
    if (!previous?.equals(bytes)) await writeFile(file, bytes);
    if (!record.dossier) {
      record.dossier = ['en'];
      await writeFile(recordFile, JSON.stringify(record, null, 2) + '\n');
    }
    console.log(`${id}: en copied for review (SHA-256 ${sha256})`);
  }
  console.log('Build and preview this private site with npm run review.');
}

async function main(args) {
  const [mode, review, language, ...selection] = args;
  const staging = mode === '--stage';
  const requested = [...new Set(staging ? selection : args)];
  if (requested.some(id => !publicationId.test(id)) ||
      (staging && (!review || language !== 'en' || !requested.length))) {
    throw new Error('Usage: npm run archive:dossier -- [character-id …] or --stage "<private site>" en <character-id …>');
  }
  loadLocalEnvironment();
  const characters = requested.length ? requested : (await readCharacterPublication()).characters.map(({ id }) => id);
  const revisions = await checkDossierSources({
    characters, characterSources: await readSourceMap('.character-sources.local.json'), includeBytes: true,
  });
  if (staging) await stage(review, revisions);
  else process.exitCode = await audit(revisions);
}

main(process.argv.slice(2)).catch(error => {
  console.error(`Complete Dossier: ${error.message}`);
  process.exitCode = 1;
});
