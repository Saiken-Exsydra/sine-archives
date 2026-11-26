import * as fs from 'node:fs/promises';
import path from 'node:path';
import { generate, inventory } from './engine.mjs';

const cmd = process.argv[2];
const dir = path.resolve('public/media');
const manifest = path.resolve('src/images/manifest.json');
const cache = path.resolve('.asset-pipeline/cache.json');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));

async function main() {
  const records = await json('tools/assets/approved.json');
  const options = { records, dir, manifest, cache };
  if (cmd === 'check' || cmd === 'report') {
    const { entries, obsolete } = await inventory(options);
    let total = 0;
    for (const [id, entry] of Object.entries(entries)) {
      const bytes = entry.variants.reduce((sum, v) => sum + v.bytes, 0);
      total += bytes;
      if (cmd === 'report') console.log(id, 'source', entry.sourceBytes + 'B;', entry.variants.map(v => v.width + 'w/' + v.bytes + 'B').join(' '));
    }
    console.log(records.length + ' approved assets, ' + total + ' publication bytes.');
    if (obsolete.length) throw Error('Review and move obsolete files out of public/media before building: ' + obsolete.join(', '));
    return;
  }
  if (!['sync', 'dry-run', 'rebuild'].includes(cmd)) throw Error('Unknown asset command.');
  try { process.loadEnvFile('.env.local'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const sources = await json('.asset-sources.local.json');
  const run = () => generate({ ...options, root: process.env.SINE_ARTWORKS, sources, dry: cmd === 'dry-run', rebuild: cmd === 'rebuild' });
  if (cmd === 'dry-run') return run();
  await fs.mkdir(path.dirname(cache), { recursive: true });
  const lock = cache + '.lock';
  const handle = await fs.open(lock, 'wx');
  try { await run(); }
  finally { await handle.close(); await fs.unlink(lock); }
}
main().catch(error => { console.error('SiNE Asset Pipeline:', error.message); process.exitCode = 1; });
