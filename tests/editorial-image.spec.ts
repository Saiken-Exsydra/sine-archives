import { test, expect } from './browser';
import path from 'node:path';

test('an isolated editorial diagram uses the delivery API at a nested deployment base', async ({ page }) => {
  const { build } = await import('vite');
  const fixture = 'editorial-diagram';
  const file = 'diagram.svg';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80"><path d="M40 40h240" stroke="black"/></svg>';
  const result = await build({
    base: '/collection/', logLevel: 'silent', publicDir: false,
    build: { write: false, rollupOptions: { input: path.resolve('tests/fixtures/editorial.tsx') } },
    plugins: [{ name: 'isolated-editorial-manifest', enforce: 'pre', load(id) {
      if (id.endsWith('/src/images/manifest.json')) {
        return JSON.stringify({ [fixture]: { variants: [{ file, width: 320, height: 80 }] } });
      }
    } }],
  });
  const chunk = (Array.isArray(result) ? result[0] : result).output.find(entry => entry.type === 'chunk')!;
  const requests: string[] = [];
  await page.route('**/collection/**', async route => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname === '/collection/') return route.fulfill({ contentType: 'text/html',
      body: '<!doctype html><script type="module" src="./entry.js"></script>' });
    if (pathname.endsWith('/entry.js')) return route.fulfill({ contentType: 'application/javascript', body: chunk.code });
    requests.push(pathname);
    if (pathname === '/collection/media/' + file) return route.fulfill({ contentType: 'image/svg+xml', body: svg });
    return route.abort();
  });
  await page.goto('/collection/');
  const diagram = page.getByAltText('Two connected reading rooms');
  await diagram.evaluate((img: HTMLImageElement) => img.decode());
  expect(await diagram.getAttribute('width')).toBe('320');
  expect(await diagram.getAttribute('height')).toBe('80');
  expect((await diagram.boundingBox())?.height).toBe(40);
  const contained = page.locator('figure img').last();
  await expect(contained).toHaveCSS('object-fit', 'contain');
  await expect(contained).toHaveCSS('object-position', '25% 75%');
  const verification = await page.evaluate(async () => {
    const api = window as any;
    const image: HTMLImageElement = await api.prepareDiagram();
    const controller = new AbortController();
    controller.abort();
    return { decoded: image.naturalWidth, valid: api.isAssetId('editorial-diagram'),
      rejected: [null, 123, {}, '__proto__', 'constructor', 'absent'].every(id => !api.isAssetId(id)),
      aborted: await api.prepareDiagram(controller.signal).catch((error: Error) => error.name) };
  });
  expect(verification).toEqual({ decoded: 160, valid: true, rejected: true, aborted: 'AbortError' });
  // Playwright interception disables HTTP caching. Verify URL identity across consumers.
  expect([...new Set(requests)]).toEqual(['/collection/media/' + file]);
});
