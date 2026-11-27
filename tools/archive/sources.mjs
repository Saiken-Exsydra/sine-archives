import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { access, readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';

export function loadLocalEnvironment() {
  try { process.loadEnvFile('.env.local'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

export async function readSourceMap(file) {
  let raw;
  try { raw = await readFile(file, 'utf8'); }
  catch (error) { throw new Error(`${file}: Could not read mapping (${error.code})`); }
  let map;
  try { map = JSON.parse(raw.replace(/^\uFEFF/, '')); }
  catch { throw new Error(`${file}: Invalid JSON`); }
  if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error(`${file}: Expected a JSON object`);
  return map;
}

export function artworkRoot(env = process.env) {
  return env.SINE_ARTWORKS || (env.SINE_ARCHIVE_ROOT && path.join(env.SINE_ARCHIVE_ROOT, 'Artworks'));
}

export function inside(root, target) {
  const relative = path.relative(root, target);
  return relative && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

export async function resolveSource(root, mapping, label) {
  const relative = typeof mapping === 'string' ? mapping.replaceAll('\\', '/') : '';
  if (relative.includes(':') || relative.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`${label}: Expected one relative source path`);
  }
  let file;
  try { file = await realpath(path.resolve(root, relative)); }
  catch (error) { throw new Error(`${label}: Source could not be resolved (${error.code})`); }
  if (!inside(root, file)) throw new Error(`${label}: Source resolves outside its configured directory`);
  if (!(await stat(file)).isFile()) throw new Error(`${label}: Expected a source file`);
  await access(file, constants.R_OK);
  return file;
}

async function directory(location, label) {
  const resolved = await realpath(location).catch(error => {
    throw new Error(`${label}: Directory could not be resolved (${error.code})`);
  });
  if (!(await stat(resolved)).isDirectory()) throw new Error(`${label}: Expected a directory`);
  return resolved;
}

export async function checkDossierSources({ env = process.env, characters, characterSources, inspect, includeBytes = false }) {
  let root, dossiers;
  try {
    if (!env.SINE_ARCHIVE_ROOT) throw new Error('Set SINE_ARCHIVE_ROOT to the local Dy’Aspora Archive directory.');
    root = await directory(env.SINE_ARCHIVE_ROOT, 'SINE_ARCHIVE_ROOT');
    dossiers = await directory(path.join(root, 'Characters'), 'Archive Characters');
    if (!inside(root, dossiers)) throw new Error('Archive Characters resolves outside the Archive');
  } catch (error) {
    return characters.map(id => unavailable(id, error));
  }

  return Promise.all(characters.map(async id => {
    try {
      const entry = Object.hasOwn(characterSources, id) && characterSources[id];
      if (!entry) throw new Error('Add a dossier entry to .character-sources.local.json');
      const { source, reviewedSha256, reviewOutcome } = entry;
      if (reviewedSha256 !== undefined && (typeof reviewedSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(reviewedSha256))) {
        throw new Error('reviewedSha256 must be a lowercase SHA-256 or omitted');
      }
      if (reviewOutcome !== undefined && (!reviewedSha256 || !['publication-updated', 'no-public-change'].includes(reviewOutcome))) {
        throw new Error('reviewOutcome requires a reviewedSha256 and must be publication-updated or no-public-change');
      }
      const file = await resolveSource(root, source, 'Dossier');
      if (!inside(dossiers, file) || path.extname(file).toLowerCase() !== '.md') {
        throw new Error('Map to a Markdown dossier under Archive Characters');
      }
      const bytes = await readFile(file);
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      const status = !reviewedSha256 ? 'unreviewed' : reviewedSha256 !== sha256 ? 'changed'
        : reviewOutcome === 'no-public-change' ? 'reviewed-no-public-change' : 'reviewed';
      const result = { id, sha256, status };
      if (inspect) result.overview = inspect(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
      if (includeBytes) result.bytes = bytes;
      return result;
    } catch (error) {
      return unavailable(id, error);
    }
  }));
}

function unavailable(id, error) {
  return { id, status: 'unavailable', reason: error.code ? `Source could not be read (${error.code})` : error.message };
}

export async function verifyArtworkSources({ env = process.env, artwork, assetSources }) {
  const location = artworkRoot(env);
  if (!location) throw new Error('Set SINE_ARCHIVE_ROOT or SINE_ARTWORKS to resolve artwork sources.');
  const artworks = await directory(location, 'Configured Artworks');
  if (!env.SINE_ARTWORKS && !inside(await directory(env.SINE_ARCHIVE_ROOT, 'SINE_ARCHIVE_ROOT'), artworks)) {
    throw new Error('Archive Artworks resolves outside the Archive');
  }
  for (const id of artwork) {
    await resolveSource(artworks, Object.hasOwn(assetSources, id) && assetSources[id], id + ' artwork');
  }
}
