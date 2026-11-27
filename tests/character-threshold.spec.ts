import { test, expect } from './browser';
import path from 'node:path';

const review = 'test-results/react-review/';

test('the threshold follows a changing featured selection and opens the decoded portrait', async ({ page }, info) => {
  const { build } = await import('vite');
  const base = '/featured-fixture/';
  const outDir = info.outputPath('featured');
  const result = await build({
    base, logLevel: 'silent', publicDir: false,
    build: { outDir, cssCodeSplit: false, rollupOptions: { input: path.resolve('tests/fixtures/featured.tsx') } },
  });
  const output = (Array.isArray(result) ? result[0] : result).output;
  const entryFile = output.find(asset => asset.type === 'chunk' && asset.isEntry)!.fileName;
  const stylesheet = output.find(asset => asset.fileName.endsWith('.css'))!.fileName;
  await page.route('**' + base + '**', route => {
    const asset = new URL(route.request().url()).pathname.slice(base.length);
    if (!asset) return route.fulfill({ contentType: 'text/html', body: `<!doctype html>
      <link rel="stylesheet" href="${stylesheet}"><script type="module" src="${entryFile}"></script>` });
    return route.fulfill({ path: path.resolve(asset.startsWith('media/') ? 'public' : outDir, asset) });
  });
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    let release!: () => void;
    const waitForHisui = new Promise<void>(resolve => { release = resolve; });
    document.addEventListener('release-hisui', release);
    HTMLImageElement.prototype.decode = async function () {
      await decode.call(this);
      if (this.currentSrc.includes('hisui-kirasagi-hero')) await waitForHisui;
    };
  });
  await page.goto(base + '?lang=en#archive-index');
  const select = (id: string) => page.evaluate(feature => {
    window.dispatchEvent(new CustomEvent('fixture:feature', { detail: feature }));
  }, id);
  const art = page.locator('.character-exhibit .scene-art');
  const featured = page.locator('.featured-caption');
  const examination = page.locator('.character-caption');
  const entry = page.getByRole('link', { name: 'Open Characters' });
  const back = page.getByRole('link', { name: 'Grand Index' });

  await expect(entry).toHaveAttribute('href', '#/characters/lenore-engelmeyer');
  await select('hisui-kirasagi');
  await expect(art).toHaveCount(2);
  await expect(featured.locator('h3')).toHaveText('Le’nore Voren Engelmeyer');
  await expect(featured).not.toHaveAttribute('data-identity-travelling', '');
  await entry.click();
  await expect(page).toHaveURL(/lenore-engelmeyer$/);
  await expect(examination).toHaveAttribute('data-identity-travelling', '');
  await page.evaluate(() => document.dispatchEvent(new Event('release-hisui')));
  await expect(art).toHaveCount(1);

  await back.click();
  await expect(featured.locator('h3')).toHaveText('Hisui Kirasagi');
  await expect(art).toHaveCount(1);
  await expect(art).toHaveAttribute('src', /hisui-kirasagi-hero/);
  await expect(entry).toHaveAttribute('href', '#/characters/hisui-kirasagi');
  const original = await art.elementHandle();
  await entry.click();
  await expect(page).toHaveURL(/hisui-kirasagi$/);
  await expect(examination).toHaveAttribute('data-identity-travelling', '');
  expect(await art.evaluate((image, previous) => image === previous, original)).toBe(true);
  await back.click();
  await expect(featured).toHaveAttribute('data-identity-travelling', '');
  await expect(featured.locator('h3')).toHaveText('Hisui Kirasagi');
  expect(await art.evaluate((image, previous) => image === previous, original)).toBe(true);
});

test('the featured name and artwork stay continuous across the threshold', async ({ page }) => {
  await page.setViewportSize({ width: 2400, height: 960 });
  await page.goto('/?lang=en#archive-index');
  await page.evaluate(() => document.fonts.ready);
  const exhibit = page.locator('.character-exhibit');
  const art = exhibit.locator('.scene-art');
  await art.evaluate((element: HTMLImageElement) => element.decode());
  await expect.poll(() => art.evaluate(el => el.getBoundingClientRect().top)).toBe(0);
  const original = await art.elementHandle();
  const initialCrop = await art.evaluate(el => getComputedStyle(el).objectPosition);
  const initialBox = await art.boundingBox();
  const entry = page.getByRole('link', { name: 'Open Characters' });
  const back = page.getByRole('link', { name: 'Grand Index' });
  const featured = exhibit.locator('.featured-caption');
  const examination = exhibit.locator('.character-caption');
  const firstWord = (caption: typeof featured) => caption.locator('h3 span').first();
  const start = (await firstWord(featured).boundingBox())!;
  await entry.focus();
  await page.keyboard.press('Enter');
  await expect(examination).toHaveAttribute('data-identity-travelling', '');
  await expect(examination.locator('h1')).toBeFocused();
  await expect(exhibit.locator('.character-domain')).toHaveAttribute('inert', '');
  await page.waitForFunction(() => {
    const word = document.querySelector('.character-caption h3 span');
    return Number(word?.getAnimations()[0]?.currentTime) > 115;
  });
  const crossing = (await firstWord(examination).boundingBox())!;
  await page.screenshot({ path: review + 'threshold-open.png' });
  await expect(examination).not.toHaveAttribute('data-identity-travelling', '');
  const end = (await firstWord(examination).boundingBox())!;
  expect(crossing.x).toBeGreaterThan(start.x);
  expect(crossing.x).toBeLessThan(end.x);
  expect(crossing.y).toBeGreaterThan(end.y);
  expect(crossing.y).toBeLessThan(start.y);
  expect(await art.evaluate((el, node) => el === node, original)).toBe(true);
  expect(await art.boundingBox()).toEqual(initialBox);
  await expect(art).toHaveCSS('object-position', initialCrop);

  await back.click();
  await expect(featured).toHaveAttribute('data-identity-travelling', '');
  await expect(featured).toHaveCSS('overflow-y', 'visible');
  await expect(page.locator('#archive-index')).toBeFocused();
  await expect(examination).toHaveAttribute('inert', '');
  await page.waitForFunction(() => {
    const word = document.querySelector('.featured-caption h3 span');
    return Number(word?.getAnimations()[0]?.currentTime) > 115;
  });
  await page.screenshot({ path: review + 'threshold-return.png' });
  expect(await art.boundingBox()).toEqual(initialBox);
  await page.goBack();
  await expect(examination).toHaveAttribute('data-identity-travelling', '');
  await page.goForward();
  await expect(exhibit).toHaveAttribute('data-expanded', 'false');
  await expect(featured).not.toHaveAttribute('data-identity-travelling', '');
  await expect(entry).toBeVisible();
  expect((await firstWord(featured).boundingBox())?.x).toBeCloseTo(start.x);
  expect(await art.evaluate((el, node) => el === node, original)).toBe(true);
});

test('a returning visitor sees the previous subject until the featured hero is decoded', async ({ page }) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    let release!: () => void;
    const waitForFeatured = new Promise<void>(resolve => { release = resolve; });
    document.addEventListener('release-featured', release);
    HTMLImageElement.prototype.decode = async function () {
      await decode.call(this);
      if (this.currentSrc.includes('lenore-engelmeyer-hero')) await waitForFeatured;
    };
  });
  await page.goto('/#/characters/hisui-kirasagi');
  await page.getByRole('link', { name: 'Grand Index' }).click();
  const exhibit = page.locator('.character-exhibit');
  await expect(exhibit).toHaveAttribute('data-featured-pending', 'true');
  await expect(exhibit.locator('.character-identity h3')).toHaveText('Hisui Kirasagi');
  await expect(exhibit.locator('.character-identity h3')).toHaveCSS('opacity', '1');
  await expect(exhibit.locator('.featured-identity h3')).toHaveCSS('opacity', '0');
  await expect(exhibit.locator('.scene-art').first()).toHaveCSS('opacity', '1');
  await page.evaluate(() => document.dispatchEvent(new Event('release-featured')));
  await expect(exhibit).toHaveAttribute('data-featured-handoff', 'true');
  await page.screenshot({ path: review + 'threshold-featured-handoff.png' });
  await expect(exhibit.locator('.scene-art')).toHaveCount(1);
  await expect(exhibit.locator('.scene-art')).toHaveAttribute('src', /lenore-engelmeyer-hero/);
  await expect(page.getByRole('heading', { name: 'Le’nore Voren Engelmeyer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hisui Kirasagi' })).toHaveCount(0);
});

test('Portuguese phone routes settle immediately in reduced motion and on direct visits', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=pt-br#/characters/lenore-engelmeyer');
  await expect(page.locator('.character-caption')).not.toHaveAttribute('data-identity-travelling', '');
  await expect(page.getByRole('tabpanel')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('link', { name: 'Grande índice' }).click();
  await expect(page.locator('.featured-caption')).not.toHaveAttribute('data-identity-travelling', '');
  await expect(page.locator('.character-exhibit')).toHaveAttribute('data-expanded', 'false');
  await page.getByRole('link', { name: 'Explorar personagens' }).click();
  await expect(page.locator('.character-caption')).not.toHaveAttribute('data-identity-travelling', '');
  await expect(page.getByRole('button', { name: 'Registro de indivíduos' })).toHaveCSS('opacity', '1');
  await page.screenshot({ path: review + 'threshold-phone-reduced.png' });
  await page.setViewportSize({ width: 320, height: 680 });
  const back = (await page.getByRole('link', { name: 'Grande índice' }).boundingBox())!;
  const tools = (await page.locator('.examination-tools .masthead-controls').boundingBox())!;
  expect(back.x + back.width).toBeLessThan(tools.x);
});
