import { test, expect } from './browser';
import { build } from 'vite';
import path from 'node:path';

test('a static subdirectory build browses 64 records with finite boundaries and supersedes a delayed choice', async ({page}) => {
  const result = await build({
    base:'/exhibit/', publicDir:false, logLevel:'silent', build:{write:false},
    plugins:[{name:'isolated-registry-records', transform(code,id) {
      if (!id.endsWith('/grand-index/characters.ts')) return;
      return code + `
        for (let i = 2; i < 64; i++) {
          const source = characters[i % 2];
          characters.push({...source, id:'fixture-'+i, name:'Study '+i, portraitFocal:'40% 30%'});
        }`;
    }}],
  });
  const output = (Array.isArray(result) ? result[0] : result).output;
  await page.route('**/exhibit/**', async route => {
    const file = new URL(route.request().url()).pathname.slice('/exhibit/'.length) || 'index.html';
    if (file.startsWith('media/')) return route.fulfill({path:path.resolve('public',file)});
    const asset = output.find(item => item.fileName === file)!;
    const body = asset.type === 'chunk' ? asset.code : asset.source;
    return route.fulfill({body:typeof body === 'string' ? body : Buffer.from(body),
      contentType:file.endsWith('.html')?'text/html':file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':undefined});
  });
  await page.setViewportSize({width:2400,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/exhibit/#/characters');
  await page.locator('.registry-trigger').click();
  const links = page.locator('.registry-portrait');
  await expect(links).toHaveCount(64);
  const track = page.locator('.registry-track');
  const prev = page.getByRole('button',{name:'Scroll left'});
  const next = page.getByRole('button',{name:'Scroll right'});
  await expect(prev).toBeDisabled();
  await next.click();
  await expect(prev).toBeEnabled();
  await track.hover();
  const before = await track.evaluate(el=>el.scrollLeft);
  await page.mouse.wheel(0,360);
  await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(before);
  await page.screenshot({path:'test-results/react-review/registry-ultrawide-fixture.png'});
  await links.nth(8).focus();
  await page.keyboard.press('End');
  await expect(links.last()).toBeFocused();
  await expect(next).toBeDisabled();
  await expect(links.last().locator('img')).toHaveCSS('object-position','40% 30%');
  await page.keyboard.press('Home');
  await expect(prev).toBeDisabled();
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/hisui-kirasagi-hero-*.webp', async route => { await gate; await route.fallback(); });
  const request = page.waitForRequest('**/hisui-kirasagi-hero-*.webp');
  await links.nth(1).click();
  await request;
  await links.nth(2).click();
  await expect(page).toHaveURL(/fixture-2$/);
  await expect(page.locator('.character-caption h3')).toHaveText('Study 2');
  release();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(2400);
});
