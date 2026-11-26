import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { profiles, widthsFor } from './profiles.mjs';

export const digest = data => createHash('sha256').update(data).digest('hex');
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const checksum = /^[0-9a-f]{64}$/;
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const readJSON = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const engineHash = digest(await fs.readFile(new URL(import.meta.url)));
const approvalStamp = record => digest(JSON.stringify([record, profiles[record.profile]]));
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

function validateRecords(records) {
  const ids = new Set();
  for (const { id, category, profile, approvedSha256 } of records) {
    if (!slug.test(id ?? '') || !slug.test(category ?? '') || !Object.hasOwn(profiles, profile) ||
        !checksum.test(approvedSha256) || ids.has(id)) throw Error('Invalid or duplicate registration: ' + id);
    ids.add(id);
  }
}

async function atomicWrite(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = file + '.' + randomUUID() + '.tmp';
  try {
    await fs.writeFile(temp, data, { flag: 'wx' });
    await fs.rename(temp, file);
  } finally { await fs.rm(temp, { force: true }); }
}

async function writeChanged(file, data) {
  try { if ((await fs.readFile(file)).equals(Buffer.from(data))) return; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await atomicWrite(file, data);
}

async function physicalPath(file) {
  try { return await fs.realpath(file); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return path.join(await physicalPath(path.dirname(file)), path.basename(file));
  }
}

function variantName(id, width, hash, format) {
  return id + '-' + width + '-' + hash.slice(0, 16) + '.' + format;
}

async function verifyEntry(dir, record, entry) {
  if (!entry || entry.approval !== approvalStamp(record) || entry.category !== record.category || entry.profile !== record.profile ||
      !Number.isSafeInteger(entry.sourceWidth) || entry.sourceWidth < 1) throw Error('Invalid entry: ' + record.id);
  const widths = entry.format === 'svg' && record.publishOriginalSvg === true
    ? [entry.sourceWidth] : widthsFor(entry.sourceWidth, entry.profile);
  if (!['webp', 'svg'].includes(entry.format) || (entry.format === 'svg' && !record.publishOriginalSvg) ||
      widths.length !== entry.variants.length) throw Error('Invalid variants: ' + record.id);
  for (const [i, variant] of entry.variants.entries()) {
    const { file, width, height, sha256, bytes } = variant;
    if (entry.format === 'svg' && sha256 !== record.approvedSha256)
      throw Error('SVG differs from approved original: ' + record.id);
    if (!checksum.test(sha256) || width !== widths[i] || file !== variantName(record.id, width, sha256, entry.format))
      throw Error('Invalid variant: ' + record.id);
    const buffer = await fs.readFile(path.join(dir, file));
    const meta = await sharp(buffer).metadata();
    if (buffer.length !== bytes || digest(buffer) !== sha256 || meta.width !== width ||
        meta.height !== height || meta.format !== entry.format) throw Error('Damaged variant: ' + file);
  }
}

export async function inventory({ records, dir, manifest }) {
  validateRecords(records);
  const entries = await readJSON(manifest);
  if (Object.keys(entries).length !== records.length) throw Error('Manifest and approvals differ. Run assets:sync.');
  const files = new Set();
  for (const record of records) {
    await verifyEntry(dir, record, entries[record.id]);
    entries[record.id].variants.forEach(v => files.add(v.file));
  }
  const obsolete = (await fs.readdir(dir)).filter(file => !files.has(file));
  return { entries, obsolete };
}

export async function generate({ records, sources, root, dir, manifest, cache, dry = false, rebuild = false, log = console.log }) {
  validateRecords(records);
  if (!root) throw Error('Set SINE_ARTWORKS to the local Artworks directory.');
  root = await fs.realpath(root);
  for (const destination of [dir, manifest, cache]) {
    const physical = await physicalPath(path.resolve(destination));
    if (!path.relative(physical, root) || inside(root, physical) || inside(physical, root))
      throw Error('Processing destinations must be outside Artworks.');
  }
  let previous = {};
  try { previous = await readJSON(cache); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const next = {}, entries = {}, seen = new Set();
  for (const record of records) {
    const { id, profile, category } = record;
    const relative = typeof sources[id] === 'string' ? sources[id].replaceAll('\\', '/') : '';
    if (relative.includes(':') || relative.split('/').some(p => !p || p === '.' || p === '..'))
      throw Error('Expected one relative source path for ' + id);
    const file = await fs.realpath(path.resolve(root, relative));
    if (!inside(root, file)) throw Error('Source outside Artworks: ' + id);
    const identity = (process.platform === 'win32' ? file.toLowerCase() : file) + ':' + profile;
    if (seen.has(identity)) throw Error('Duplicate source/profile: ' + id);
    seen.add(identity);
    const input = await fs.readFile(file);
    if (digest(input) !== record.approvedSha256) throw Error('Source differs from approved artwork: ' + id);
    const signature = digest(JSON.stringify([engineHash, sharp.versions, record, profiles[profile]]));
    let entry = previous[id]?.entry;
    let reuse = !rebuild && previous[id]?.signature === signature;
    if (reuse) {
      try { await verifyEntry(dir, record, entry); }
      catch { reuse = false; }
    }
    const meta = await sharp(input).metadata();
    const width = meta.autoOrient.width;
    const vector = meta.format === 'svg';
    if (!(vector ? record.publishOriginalSvg === true : ['webp','jpeg','png'].includes(meta.format)) || (meta.pages ?? 1) > 1)
      throw Error('Unsupported format, animation or unapproved SVG original: ' + id);
    const widths = vector ? [width] : widthsFor(width, profile);
    log((reuse ? 'Reuse ' : 'Generate ') + id + ' [' + widths.join(', ') + ']');
    if (dry) continue;
    if (!reuse) {
      entry = { category, profile, approval: approvalStamp(record), sourceBytes: input.length, sourceWidth: width, format: vector ? 'svg' : 'webp', variants: [] };
      for (const w of widths) {
        const output = vector ? input : await sharp(input).autoOrient().resize({width: w, withoutEnlargement: true})
          .toColourspace('srgb').webp({ quality: profiles[profile].quality, alphaQuality: 100, effort: 5 }).toBuffer();
        const { width, height } = await sharp(output).metadata();
        const sha256 = digest(output);
        const file = variantName(id, width, sha256, entry.format);
        await writeChanged(path.join(dir, file), output);
        log('  ' + file + ' (' + output.length + ' bytes)');
        entry.variants.push({ file, width, height, bytes: output.length, sha256 });
      }
    }
    entries[id] = entry;
    next[id] = { signature, entry, sourceBytes: input.length };
  }
  if (!dry) {
    await writeChanged(manifest, serialize(entries));
    await writeChanged(cache, serialize(next));
  }
}
