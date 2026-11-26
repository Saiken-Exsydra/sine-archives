import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { access, readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';

export function loadLocalEnvironment() {
  try { process.loadEnvFile('.env.local'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
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

export async function verifyArchive({ env = process.env, characters, artwork, characterSources, assetSources }) {
  if (!env.SINE_ARCHIVE_ROOT) throw new Error('Set SINE_ARCHIVE_ROOT to the local Dy’Aspora Archive directory.');
  const root = await directory(env.SINE_ARCHIVE_ROOT, 'SINE_ARCHIVE_ROOT');
  const dossiers = await directory(path.join(root, 'Characters'), 'Archive Characters');
  const artworks = await directory(artworkRoot(env), 'Configured Artworks');
  if (!inside(root, dossiers)) throw new Error('Archive Characters resolves outside the Archive');
  if (!env.SINE_ARTWORKS && !inside(root, artworks)) throw new Error('Archive Artworks resolves outside the Archive');

  const revisions = [];
  for (const id of characters) {
    const entry = Object.hasOwn(characterSources, id) && characterSources[id];
    if (!entry) throw new Error(`${id}: Add a dossier entry to .character-sources.local.json`);
    const { source, reviewedSha256 } = entry;
    if (reviewedSha256 !== undefined && (typeof reviewedSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(reviewedSha256))) {
      throw new Error(`${id}: reviewedSha256 must be a lowercase SHA-256 or omitted`);
    }
    const file = await resolveSource(root, source, id + ' dossier');
    if (!inside(dossiers, file) || path.extname(file).toLowerCase() !== '.md') {
      throw new Error(`${id}: Map to a Markdown dossier under Archive Characters`);
    }
    const sha256 = createHash('sha256').update(await readFile(file)).digest('hex');
    const status = !reviewedSha256 ? 'unreviewed' : reviewedSha256 === sha256 ? 'reviewed' : 'changed';
    revisions.push({ id, sha256, status });
  }
  for (const id of artwork) {
    await resolveSource(artworks, Object.hasOwn(assetSources, id) && assetSources[id], id + ' artwork');
  }
  return revisions;
}
