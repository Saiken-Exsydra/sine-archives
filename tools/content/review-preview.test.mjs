import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { test } from 'node:test';
import { characterReviewPlugin, reviewMarker, reviewPath } from './review-preview.mjs';

test('the development server exposes only the active loopback review build', async t => {
  const directory = await mkdtemp(path.join(tmpdir(), 'sine-review-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const first = path.join(directory, 'build-first');
  const second = path.join(directory, 'build-second');
  const marker = path.join(directory, reviewMarker);
  await mkdir(path.join(first, 'assets'), { recursive: true });
  await mkdir(second);
  await writeFile(path.join(first, 'index.html'), '<title>First edition</title>');
  await writeFile(path.join(first, 'assets', 'entry.js'), 'export const review = true;');
  await writeFile(path.join(first, '.env'), 'PRIVATE');
  await writeFile(path.join(second, 'index.html'), '<title>Revised edition</title>');

  let review;
  characterReviewPlugin(() => directory).configureServer({
    config: { root: directory, logger: { error: message => assert.fail(message) } },
    middlewares: { use(mount, handler) { assert.equal(`${mount}/`, reviewPath); review = handler; } },
  });

  async function request(url, { method = 'GET', host = 'localhost:5174', address = '::1' } = {}) {
    const response = new PassThrough();
    const chunks = [];
    response.on('data', chunk => chunks.push(chunk));
    response.writeHead = (status, headers) => Object.assign(response, { status, headers, headersSent: true });
    const finished = once(response, 'end');
    review({ url, method, headers: { host }, socket: { remoteAddress: address } }, response);
    await finished;
    return { status: response.status, headers: response.headers, body: Buffer.concat(chunks).toString() };
  }

  assert.equal((await request('/')).status, 404);
  await writeFile(marker, 'build-first');
  const page = await request('/?lang=en');
  assert.equal(page.status, 200);
  assert.match(page.body, /First edition/);
  assert.equal(page.headers['Cache-Control'], 'no-store');
  const asset = await request('/assets/entry.js');
  assert.match(asset.headers['Content-Type'], /javascript/);
  assert.match(asset.body, /export const/);
  assert.equal((await request('/assets/entry.js', { method: 'HEAD' })).body, '');
  assert.equal((await request('/.env')).status, 404);
  assert.equal((await request('/assets/%2e%2e%2findex.html')).status, 404);
  assert.equal((await request('/', { host: 'external.example' })).status, 403);
  assert.equal((await request('/', { address: '192.0.2.10' })).status, 403);

  await writeFile(marker, 'build-second');
  assert.match((await request('/')).body, /Revised edition/);
  assert.equal((await request('/assets/entry.js')).status, 404);
  await rm(marker);
  assert.equal((await request('/')).status, 404);
});
