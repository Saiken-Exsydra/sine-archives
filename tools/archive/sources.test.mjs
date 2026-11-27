import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { overviewEvidence } from './overview-evidence.mjs';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { artworkRoot, checkDossierSources, verifyArtworkSources } from './sources.mjs';

const check = fileURLToPath(new URL('./check.mjs', import.meta.url));
const dossier = fileURLToPath(new URL('./dossier.mjs', import.meta.url));

async function fixture(t) {
  const tempParent = await realpath(tmpdir());
  const temp = await mkdtemp(path.join(tempParent, 'sine-archive-test-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const root = path.join(temp, 'Dy’Aspora — author\'s Archive');
  const source = "Characters/Léa's Dossier.md";
  const image = "Pictures/Criação — Léa's art.png";
  await mkdir(path.join(root, 'Characters'), { recursive: true });
  await mkdir(path.join(root, 'Artworks', 'Pictures'), { recursive: true });
  await writeFile(path.join(root, source), '# Original source\n');
  await writeFile(path.join(root, 'Artworks', image), 'Synthetic art referenced by path only');
  const options = {
    env: { SINE_ARCHIVE_ROOT: root },
    characters: ['lea'],
    artwork: ['study'],
    characterSources: { lea: { source } },
    assetSources: { study: image.replaceAll('/', '\\') },
  };
  return { options, root, source, temp };
}

test('reports exact dossier revisions and resolves Unicode files after relocation', async t => {
  const { options, root, source, temp } = await fixture(t);
  const [initial] = await checkDossierSources(options);
  assert.equal(initial.status, 'unreviewed');
  options.characterSources.lea.reviewedSha256 = initial.sha256;
  const relocated = path.join(temp, 'Moved Archive — Recife');
  assert.equal(path.dirname(await realpath(root)), temp);
  assert.equal(path.dirname(relocated), temp);
  await rename(root, relocated);
  options.env.SINE_ARCHIVE_ROOT = relocated;
  const [same] = await checkDossierSources(options);
  assert.equal(same.status, 'reviewed');
  assert.equal(same.sha256, initial.sha256);
  await writeFile(path.join(relocated, source), '# Changed canonical source\n');
  const [changed] = await checkDossierSources(options);
  assert.equal(changed.status, 'changed');
  assert.notEqual(changed.sha256, initial.sha256);
  assert.equal(options.characterSources.lea.reviewedSha256, initial.sha256);
});

test('keeps the legacy artwork override and rejects unsafe or broken mappings', async t => {
  const { options, root, source, temp } = await fixture(t);
  assert.equal(artworkRoot(options.env), path.join(root, 'Artworks'));
  const legacy = path.join(temp, "Legacy Artwork's Location");
  assert.equal(artworkRoot({ SINE_ARTWORKS: legacy }), legacy);
  await rename(path.join(root, 'Artworks'), legacy);
  options.env.SINE_ARTWORKS = legacy;
  await verifyArtworkSources(options);
  options.characterSources.lea.source = '../outside.md';
  assert.match((await checkDossierSources(options))[0].reason, /Expected one relative source path/);
  options.characterSources.lea.source = source.replace('Léa', 'Missing');
  assert.match((await checkDossierSources(options))[0].reason, /Source could not be resolved/);
  options.characterSources.lea.source = source;
  await symlink(legacy, path.join(root, 'Characters', 'outside'), 'junction');
  options.characterSources.lea.source = 'Characters/outside/' + options.assetSources.study.replaceAll('\\', '/');
  assert.match((await checkDossierSources(options))[0].reason, /Source resolves outside/);
  await symlink(path.join(root, 'Characters'), path.join(legacy, 'outside'), 'junction');
  options.assetSources.study = 'outside/' + path.basename(source);
  await assert.rejects(verifyArtworkSources(options), /study artwork: Source resolves outside/);
});

test('reports unavailable and pending dossiers together, without requiring artwork for targeted checks', async t => {
  const { options, temp } = await fixture(t);
  const map = path.join(temp, '.character-sources.local.json');
  const [initial] = await checkDossierSources(options);
  options.characterSources.lea.reviewedSha256 = initial.sha256;
  options.characterSources.lea.reviewOutcome = 'no-public-change';
  options.characterSources.draft = { source: options.characterSources.lea.source };
  const bytes = JSON.stringify(options.characterSources);
  await writeFile(map, bytes);
  const run = (...ids) => spawnSync(process.execPath, [check, ...ids], {
    cwd: temp, env: { ...process.env, ...options.env, SINE_ARTWORKS: path.join(temp, 'missing-artwork') }, encoding: 'utf8',
  });
  assert.equal(run('lea').status, 0);
  assert.equal(run('draft').status, 2);
  const mixed = run('unmapped', 'lea', 'draft');
  assert.equal(mixed.status, 1);
  assert.match(mixed.stdout, /unmapped: unavailable/);
  assert.match(mixed.stdout, /lea: reviewed-no-public-change/);
  assert.match(mixed.stdout, /draft: unreviewed/);
  assert.equal(await readFile(map, 'utf8'), bytes);
  assert.equal((await checkDossierSources({ ...options, env: {} }))[0].status, 'unavailable');
});

test('stages the original English dossier bytes only in a private site', async t => {
  const { options, root, source, temp } = await fixture(t);
  const map = path.join(temp, '.character-sources.local.json');
  const original = Buffer.from('\uFEFF# Léa\r\n\r\n## Annex\r\nFull text.\r\n');
  await writeFile(path.join(root, source), original);
  const mapping = JSON.stringify(options.characterSources);
  await writeFile(map, mapping);

  const site = path.join(temp, 'review');
  const folder = path.join(site, 'src/content/characters/lea');
  const recordFile = path.join(folder, 'record.json');
  const record = { name: 'Léa' };
  await mkdir(folder, { recursive: true });
  await writeFile(recordFile, JSON.stringify(record));

  const run = (...args) => spawnSync(process.execPath, [dossier, ...args], {
    cwd: temp, env: { ...process.env, ...options.env }, encoding: 'utf8',
  });
  const before = run('lea');
  assert.equal(before.status, 2, before.stderr);
  assert.match(before.stdout, /no published English dossier/);
  assert.equal(run('--stage', root, 'en', 'lea').status, 1);
  assert.equal(run('--stage', path.resolve('.'), 'en', 'lea').status, 1);
  assert.equal(run('--stage', site, 'pt-BR', 'lea').status, 1);
  assert.equal(run('--stage', site, 'en', 'lea', 'unmapped').status, 1);
  const staged = path.join(folder, 'dossier.en.md');
  await assert.rejects(readFile(staged), { code: 'ENOENT' });

  const prepared = run('--stage', site, 'en', 'lea');
  assert.equal(prepared.status, 0, prepared.stderr);
  assert.match(prepared.stdout, /lea: en copied for review \(SHA-256 [a-f0-9]{64}\)/);
  assert.deepEqual(await readFile(staged), original);
  assert.deepEqual(JSON.parse(await readFile(recordFile, 'utf8')), { ...record, dossier: ['en'] });
  assert.equal(await readFile(map, 'utf8'), mapping);
});

test('only an explicitly promoted edition changes the ordinary build', async t => {
  const { options, root, source, temp } = await fixture(t);
  const app = path.join(temp, 'site');
  await cp('src', path.join(app, 'src'), { recursive: true });
  await cp('index.html', path.join(app, 'index.html'));
  await symlink(path.resolve('node_modules'), path.join(app, 'node_modules'), 'junction');
  const folder = path.join(app, 'src/content/characters/lenore-engelmeyer');
  const publication = path.join(folder, 'biography.en.md');
  const original = await readFile(publication, 'utf8');
  const map = path.join(temp, '.character-sources.local.json');
  const fixtureSource = path.join(root, source);
  const [baseline] = await checkDossierSources(options);
  options.characterSources['lenore-engelmeyer'] = { source, reviewedSha256: baseline.sha256 };
  const savedMap = JSON.stringify(options.characterSources);
  await writeFile(map, savedMap);
  const checkOptions = { cwd: temp, env: { ...process.env, ...options.env }, encoding: 'utf8' };
  const id = 'lenore-engelmeyer';
  assert.match(execFileSync(process.execPath, [check, id], checkOptions), /lenore-engelmeyer: reviewed \(/);

  async function bundle() {
    const result = await build({ root: app, configFile: path.resolve('vite.config.ts'), envDir: false,
      publicDir: false, logLevel: 'silent', build: { write: false } });
    return Object.fromEntries(result.output.map(file => [file.fileName, file.type === 'chunk' ? file.code : file.source]));
  }

  const approvedBuild = await bundle();
  await writeFile(fixtureSource, 'Private canon fixture');
  const changed = spawnSync(process.execPath, [check, id], checkOptions);
  assert.equal(changed.status, 2);
  assert.match(changed.stdout, /lenore-engelmeyer: changed/);
  const draft = path.join(temp, 'biography.en.md');
  await writeFile(draft, 'Prepared public fixture');
  assert.equal(await readFile(publication, 'utf8'), original);
  assert.equal(await readFile(map, 'utf8'), savedMap);
  assert.deepEqual(await bundle(), approvedBuild);

  // Simulate the agent's explicit handoff after editorial approval of these bytes.
  await cp(draft, publication);
  const [revision] = await checkDossierSources({ ...options, characters: [id] });
  options.characterSources[id].reviewedSha256 = revision.sha256;
  options.characterSources[id].reviewOutcome = 'publication-updated';
  await writeFile(map, JSON.stringify(options.characterSources));
  assert.match(execFileSync(process.execPath, [check, id], checkOptions), /lenore-engelmeyer: reviewed \(/);
  const approvedText = Object.values(await bundle()).join('\n');
  assert.match(approvedText, /Prepared public fixture/);
  assert.doesNotMatch(approvedText, /Private canon fixture/);
});
test('indexes different dossier formats and keeps potentially competing values for review', () => {
  const result = overviewEvidence([
    '# Vital record',
    '| **Year of Birth** | c. Imperial Year 1103 (age 55 Lunar Years at filing, IY 1127) |',
    '| **Actual Birthplace** | A sealed site |',
    '| **Registered Birthplace** | A country |',
    ' Nationality               Ardeatan and Synesian',
    '**Anchor Depth:** Deep Anchor / Abyssal review pending',
    'Chronological Age Approximately 1,296 Lunar Years',
    'She has no fixed residence and usually dwells in the forests.',
  ].join('\n'));
  assert.deepEqual(result.age.labeled.map(({line}) => line), [2, 7]);
  assert.deepEqual(result.birthplace.labeled.map(({label}) => label), ['Actual Birthplace', 'Registered Birthplace']);
  assert.equal(result.birthplace.labeled[0].indication, 'restricted-candidate');
  assert.equal(result.birthplace.labeled[1].indication, undefined);
  assert.equal(result.nationality.labeled[0].value, 'Ardeatan and Synesian');
  assert.equal(result.capability.labeled[0].value, 'Deep Anchor / Abyssal review pending');
  assert.equal(result.capability.labeled[0].indication, 'in-world-uncertainty');
  assert.equal(result.residence.prose[0].section, 'Vital record');
  assert.equal(result.residence.needsReading, true);
});
