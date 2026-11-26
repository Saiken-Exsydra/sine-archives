import assert from 'node:assert/strict';
import { mkdir, mkdtemp, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { artworkRoot, verifyArchive } from './sources.mjs';

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
  const [initial] = await verifyArchive(options);
  assert.equal(initial.status, 'unreviewed');
  options.characterSources.lea.reviewedSha256 = initial.sha256;
  const relocated = path.join(temp, 'Moved Archive — Recife');
  assert.equal(path.dirname(await realpath(root)), temp);
  assert.equal(path.dirname(relocated), temp);
  await rename(root, relocated);
  options.env.SINE_ARCHIVE_ROOT = relocated;
  const [same] = await verifyArchive(options);
  assert.equal(same.status, 'reviewed');
  assert.equal(same.sha256, initial.sha256);
  await writeFile(path.join(relocated, source), '# Changed canonical source\n');
  const [changed] = await verifyArchive(options);
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
  assert.equal((await verifyArchive(options)).length, 1);
  options.characterSources.lea.source = '../outside.md';
  await assert.rejects(verifyArchive(options), /lea dossier: Expected one relative source path/);
  options.characterSources.lea.source = source.replace('Léa', 'Missing');
  await assert.rejects(verifyArchive(options), /lea dossier: Source could not be resolved/);
  options.characterSources.lea.source = source;
  await symlink(path.join(root, 'Characters'), path.join(legacy, 'outside'), 'junction');
  options.assetSources.study = 'outside/' + path.basename(source);
  await assert.rejects(verifyArchive(options), /study artwork: Source resolves outside/);
});
