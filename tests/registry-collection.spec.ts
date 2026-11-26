import { test, expect } from './browser';
import { build } from 'vite';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

test('a static subdirectory build discovers 64 records and supersedes a delayed choice', async ({page}, testInfo) => {
  const root = testInfo.outputPath('publication');
  await cp('src', path.join(root, 'src'), { recursive: true });
  await cp('index.html', path.join(root, 'index.html'));
  const publication = path.join(root, 'src/content/characters');
  const examples = ['lenore-engelmeyer', 'hisui-kirasagi'];
  for (let i = 2; i < 64; i++) {
    const fixture = path.join(publication, 'fixture-' + i);
    await cp(path.join(publication, examples[i % 2]), fixture, { recursive: true });
    const file = path.join(fixture, 'record.json');
    const { hero, portrait } = JSON.parse(await readFile(file, 'utf8'));
    await writeFile(file, JSON.stringify({
      name: 'Study ' + i, shortName: 'Study ' + i,
      designation: { en: 'Fixture', 'pt-BR': 'Exemplo' },
      summary: 'Test record', hero, portrait, overview: {},
      order: (i + 1) * 10, portraitFocal: '40% 30%',
    }));
  }
  const result = await build({
    root, configFile: path.resolve('vite.config.ts'), base:'/exhibit/',
    publicDir:false, logLevel:'silent', build:{write:false},
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
  const wallLight = page.locator('.registry-wall-light');
  await expect(wallLight).toHaveAttribute('data-lit','true');
  const center = await links.last().evaluate(el => {
    const bounds = el.getBoundingClientRect();
    return bounds.left + bounds.width / 2;
  });
  await expect.poll(() => wallLight.evaluate(el => parseFloat((el as HTMLElement).style.getPropertyValue('--light-x')))).toBeCloseTo(center, 0);
  await track.evaluate(el => el.scrollTo({left:0, behavior:'instant'}));
  await expect(wallLight).toHaveAttribute('data-lit','false');
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
  await page.getByRole('link', { name: 'Português (BR)' }).click();
  await expect(page.locator('.character-rank')).toHaveText('Exemplo');
  await expect(page).toHaveURL(/\/exhibit\/\?lang=pt-br#\/characters\/fixture-2$/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(2400);
});
