import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { digest, generate, inventory } from './engine.mjs';

async function fixture(t) {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'sine-images-'));
  t.after(() => fs.rm(temp, { recursive: true, force: true }));
  const root = path.join(temp, 'Artworks');
  await fs.mkdir(path.join(root, 'Places'), { recursive: true });
  const records = [], sources = {}, messages = [];
  const options = { records, sources, root, dir: path.join(temp, 'media'), manifest: path.join(temp, 'manifest.json'),
    cache: path.join(temp, 'cache.json'), log: line => messages.push(line) };
  async function register(id, data, extension) {
    const name = "Places/L’été d'Aïda " + id + '.' + extension;
    await fs.writeFile(path.join(root, name), data);
    sources[id] = name.replaceAll('/', '\\');
    const record = { id, category: 'place', profile: 'thumbnail', approvedSha256: digest(data) };
    records.push(record);
    return record;
  }
  return { ...options, options, messages, register };
}
const image = () => sharp({ create: { width: 230, height: 80, channels: 4, background: '#44444480' } });

test('registered raster and vector variants retain composition and strip raster metadata', async t => {
  const f = await fixture(t);
  await f.register('transparent', await image().png().toBuffer(), 'png');
  await f.register('rotated', await image().jpeg().withMetadata({ orientation: 6 }).toBuffer(), 'jpg');
  await f.register('wide', await image().webp().toBuffer(), 'webp');
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="33" height="20"><rect width="33" height="20"/></svg>');
  const vector = await f.register('vector', svg, 'svg');
  await assert.rejects(generate({ ...f.options, dry: true }), /unapproved SVG/);
  vector.publishOriginalSvg = true;
  await fs.writeFile(path.join(f.root, 'unregistered.png'), 'private');
  await generate({ ...f.options, dry: true });
  await assert.rejects(fs.stat(f.dir), { code: 'ENOENT' });
  await generate(f.options);
  const { entries, obsolete } = await inventory(f.options);
  assert.deepEqual(obsolete, []);
  assert.equal((await fs.readdir(f.dir)).length, 8);
  assert.deepEqual(entries.transparent.variants.map(v => v.width), [96, 192, 230]);
  const inspect = async v => sharp(await fs.readFile(path.join(f.dir, v.file))).metadata();
  assert.equal((await inspect(entries.transparent.variants[0])).hasAlpha, true);
  const rotated = await inspect(entries.rotated.variants[0]);
  assert.deepEqual([rotated.width, rotated.height, rotated.exif], [80, 230, undefined]);
  assert.deepEqual(await fs.readFile(path.join(f.dir, entries.vector.variants[0].file)), svg);
  assert.doesNotMatch(await fs.readFile(f.manifest, 'utf8'), /Aïda|Places|unregistered/);
});

test('incremental sync verifies files, repairs damage and preserves the previous manifest on failure', async t => {
  const f = await fixture(t);
  const buffer = await image().png().toBuffer();
  await f.register('garden', buffer, 'png');
  await generate(f.options);
  const before = await fs.stat(f.manifest);
  f.messages.length = 0;
  await generate(f.options);
  assert.match(f.messages.join(''), /^Reuse /);
  assert.equal((await fs.stat(f.manifest)).mtimeMs, before.mtimeMs);
  const { entries } = await inventory(f.options);
  const [first, second] = entries.garden.variants;
  await fs.unlink(path.join(f.dir, first.file));
  await fs.writeFile(path.join(f.dir, second.file), 'damaged');
  await assert.rejects(inventory(f.options));
  await generate(f.options);
  await inventory(f.options);
  await generate({ ...f.options, rebuild: true });
  assert.equal((await fs.stat(f.manifest)).mtimeMs, before.mtimeMs);
  await f.register('broken', Buffer.from('not an image'), 'png');
  await assert.rejects(generate(f.options), /unsupported image format/i);
  assert.equal((await fs.stat(f.manifest)).mtimeMs, before.mtimeMs);
  f.records.pop();
  f.records[0].profile = 'illustration';
  await assert.rejects(inventory(f.options));
  await generate(f.options);
  assert.ok((await inventory(f.options)).obsolete.length > 0);
});

test('rejects missing, duplicate, escaped and changed sources', async t => {
  const f = await fixture(t);
  const record = await f.register('garden', await image().png().toBuffer(), 'png');
  const source = f.sources.garden;
  for (const bad of ['../secret.png', '/secret.png', 'C:\\private.png', 'Places/missing.png', null]) {
    f.sources.garden = bad;
    await assert.rejects(generate(f.options));
  }
  f.sources.garden = source;
  f.records.push(record);
  await assert.rejects(generate(f.options), /duplicate registration/);
  f.records[1] = { ...record, id: 'other' };
  f.sources.other = source;
  await assert.rejects(generate({ ...f.options, dry: true }), /Duplicate source/);
  f.records.pop();
  await assert.rejects(generate({ ...f.options, dir: path.join(f.root, 'bad') }), /outside Artworks/);
  record.approvedSha256 = '0'.repeat(64);
  await assert.rejects(generate(f.options), /differs from approved/);
});
