import { expect, test } from './browser';
import { build } from 'vite';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Sample the actual boxes, including the panel's top border and visible text blocks.
function territoryGeometry(caption: Element) {
  const live = '.examination-content:not([inert])';
  const elements = caption.querySelectorAll([
    'h1', 'h3', '.character-rank', '.examination-reading', live,
    ...['.personal-particulars > div:first-child dt', '.archival-insignia', '.examination-passage h4',
      '.examination-passage p'].map(selector => live + ' ' + selector),
  ].join(','));
  const box = caption.getBoundingClientRect();
  return { left: box.left, right: box.right,
    error: Math.max(...Array.from(elements, el => Math.abs(el.getBoundingClientRect().left - box.left))) };
}

const viewports = [[1440, 900], [2400, 900], [390, 844]];
for (const { width, height, locale } of viewports.flatMap(([width, height]) =>
  ['en', 'pt-br'].map(locale => ({ width, height, locale })))) {
  test(`both individuals retain their environment through examination at ${width}px in ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const id of ['lenore-engelmeyer', 'hisui-kirasagi']) {
      const hisui = id === 'hisui-kirasagi';
      const affiliation = hisui ? ['Household service', 'Serviço doméstico'] : ['Blood lineage', 'Linhagem de sangue'];
      await page.goto('/?lang=' + locale + '#/characters/' + id);
      const hero = page.locator('.character-exhibit .scene-art');
      await expect(page.locator('.character-caption h3')).toContainText(hisui ? 'Hisui' : 'Engelmeyer');
      await expect(hero).toHaveCount(1);
      await hero.evaluate((image: HTMLImageElement) => image.decode());
      const original = await hero.elementHandle();
      const caption = page.locator('.character-exhibit .character-caption');
      const overview = await caption.evaluate(territoryGeometry);
      const name = await caption.locator('h3').elementHandle();
      const bounds = await hero.boundingBox();
      const source = await hero.evaluate((image: HTMLImageElement) => image.currentSrc);
      await expect(page.locator('.affiliation-insignia:visible')).toContainText(affiliation[locale === 'en' ? 0 : 1]);
      await expect(page.locator('.affiliation-insignia img')).toHaveCount(0);
      const tabs = page.getByRole('tab');
      await tabs.first().focus();
      for (const key of ['ArrowDown', 'ArrowDown', 'End', 'Home']) await page.keyboard.press(key);
      await expect(tabs.first()).toBeFocused();
      await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
      const summary = page.locator('.examination-content:not([inert]) .archival-insignia summary').first();
      await summary.press('Enter');
      await expect(page.locator('details[open] a')).toHaveAttribute('href', '#/systems/' + (hisui ? 'bloom' : 'redactory'));
      await page.keyboard.press('Space');
      for (const [index, section] of ['overview', 'biography', 'abilities', 'relations'].entries()) {
        await tabs.nth(index).click();
        await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('.examination-content')).toHaveCount(1);
        await expect(page.locator('.examination-content')).toHaveCSS('opacity', '1');
        await page.mouse.move(0, 0);
        await page.evaluate(() => document.fonts.ready);
        await caption.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
        const geometry = await caption.evaluate(territoryGeometry);
        expect(geometry.error).toBeLessThanOrEqual(0.5);
        expect(Math.abs(geometry.right - overview.right)).toBeLessThanOrEqual(0.5);
        if (width > 700 && index > 0) expect(geometry.left).toBeLessThan(overview.left - 1);
        else expect(Math.abs(geometry.left - overview.left)).toBeLessThanOrEqual(0.5);
        expect(await caption.locator('h3').evaluate((el, initial) => el === initial, name)).toBe(true);
        await page.screenshot({path: `test-results/phase-v/${locale}/${id}-${width}-${section}.png`});
        expect(await hero.evaluate((el, prev) => el === prev, original)).toBe(true);
        expect(await hero.boundingBox()).toEqual(bounds);
        expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toBe(source);
        expect(await page.getByRole('tabpanel').evaluate(el => el.clientHeight)).toBeGreaterThan(60);
      }
      await page.goBack();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
      if (hisui) await expect(page.locator('.archival-insignia')).not.toContainText(/Anchor|Âncora/i);
    }
  });
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`the common edge survives interrupted selections with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?lang=pt-br#/characters/lenore-engelmeyer');
    await page.evaluate(() => document.fonts.ready);
    const caption = page.locator('.character-exhibit .character-caption');
    const initial = await caption.evaluate(territoryGeometry);
    const tabs = page.getByRole('tab');
    for (const index of [1, 0, 2, 3, 0]) {
      await tabs.nth(index).evaluate(el => el.click());
      await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
      for (let frame = 0; frame < 3; frame++) {
        await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
        const current = await caption.evaluate(territoryGeometry);
        expect(current.error).toBeLessThanOrEqual(0.5);
        expect(Math.abs(current.right - initial.right)).toBeLessThanOrEqual(0.5);
      }
      if (reducedMotion === 'reduce') expect(await caption.evaluate(el => el.getAnimations().length)).toBe(0);
    }
    await expect.poll(async () => Math.abs((await caption.evaluate(territoryGeometry)).left - initial.left)).toBeLessThanOrEqual(0.5);
  });
}

test('long Unicode identities wrap within the examination and dossier reading territories', async ({page}, info) => {
  test.setTimeout(90_000);
  const root = info.outputPath('publication');
  await cp('src', path.join(root, 'src'), { recursive: true });
  await cp('index.html', path.join(root, 'index.html'));
  const characters = path.join(root, 'src/content/characters');
  const fixture = path.join(characters, 'long-identity');
  await cp(path.join(characters, 'hisui-kirasagi'), fixture, { recursive: true });
  const name = 'Íðunn D’Arçant Cósmica Łucja Zéphyrine Éléonore Ó Briain N’Diaye Çelik Żółć ' +
    'Magnúsdóttir'.repeat(7);
  const originalFeature = path.join(characters, 'lenore-engelmeyer', 'record.json');
  await writeFile(originalFeature, JSON.stringify({ ...JSON.parse(await readFile(originalFeature, 'utf8')), featured: false }));
  const record = path.join(fixture, 'record.json');
  await writeFile(record, JSON.stringify({
    ...JSON.parse(await readFile(record, 'utf8')), name, shortName: 'Íðunn', featured: true, dossier: ['en', 'pt-BR'],
  }));
  for (const lang of ['en', 'pt-BR']) await writeFile(path.join(fixture, 'dossier.' + lang + '.md'), '## Specimen\n\nStudy text.');
  const dist = path.join(root, 'dist');
  await build({ root, configFile: path.resolve('vite.config.ts'), publicDir: path.resolve('public'),
    base: '/identity/', logLevel: 'silent', build: {outDir:dist} });
  await page.route('**/identity/**', route => {
    const asset = new URL(route.request().url()).pathname.slice('/identity/'.length) || 'index.html';
    return route.fulfill({path:path.join(dist, asset)});
  });
  const caption = page.locator('.character-caption');
  const heading = caption.locator('h3');
  const dossierHeading = page.locator('.dossier-mast h1');
  function nameGeometry(el: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const box = el.getBoundingClientRect();
    const lines = [...range.getClientRects()];
    return {
      wraps: new Set(lines.map(line => line.top)).size > 1,
      fitsWidth: lines.every(line => line.left >= box.left - 1 && line.right <= box.right + 1),
      fitsHeight: el.scrollHeight <= el.clientHeight + 1,
      overflow: getComputedStyle(el).overflowY,
      lastLine: lines.at(-1)!.bottom,
    };
  }
  for (const [locale, width, height] of [['en',1440,900], ['pt-br',2560,1080], ['pt-br',820,720],
    ['en',390,844], ['pt-br',390,565]] as const) {
    await page.setViewportSize({width,height});
    await page.goto('/identity/?lang=' + locale + '#/characters/long-identity/biography');
    await expect(heading).toHaveText(name);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await heading.evaluate(nameGeometry);
    expect(geometry).toMatchObject({wraps:true, fitsWidth:true, fitsHeight:true, overflow:'visible'});
    const rank = (await caption.locator('.character-rank').boundingBox())!;
    const reader = page.getByRole('tabpanel');
    expect(rank.y).toBeGreaterThan(geometry.lastLine - 1);
    expect((await reader.boundingBox())!.y).toBeGreaterThan(rank.y + rank.height);
    expect((await caption.evaluate(territoryGeometry)).error).toBeLessThanOrEqual(.5);
    expect(await heading.evaluate(el => { el.scrollTop = 30; return el.scrollTop; })).toBe(0);
    if (width === 390 && height === 565) {
      await expect(caption).toHaveAttribute('data-scroll-all', '');
      await expect(reader).toHaveCSS('overflow-y', 'visible');
      await heading.hover();
      await page.mouse.wheel(0,220);
      await expect.poll(() => caption.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      await page.getByRole('tab', {name:'Habilidades'}).click();
      await expect.poll(() => caption.evaluate(el => el.scrollTop)).toBe(0);
      await page.setViewportSize({width:1440,height:1250});
      await expect(caption).not.toHaveAttribute('data-scroll-all', '');
    }
    await page.getByRole('link', { name:/^(Complete Dossier|Dossiê completo)$/ }).click();
    await expect(dossierHeading).toHaveText(name);
    expect(await dossierHeading.evaluate(nameGeometry)).toMatchObject({fitsWidth:true, fitsHeight:true, overflow:'visible'});
    await expect(page.locator('.dossier-scroll').getByText('Study text.')).toBeVisible();
  }
  await page.setViewportSize({width:320,height:340});
  const layout = page.locator('.dossier-layout');
  const dossierText = page.locator('.dossier-scroll').getByText('Study text.');
  const close = page.getByRole('link', {name:'Fechar Dossiê'});
  const closePosition = await close.boundingBox();
  await dossierText.scrollIntoViewIfNeeded();
  await expect(dossierText).toBeInViewport();
  await expect.poll(() => layout.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await close.boundingBox()).toEqual(closePosition);

  await page.setViewportSize({ width: 390, height: 565 });
  await page.goto('/identity/?lang=en#archive-index');
  const featured = page.locator('.featured-caption');
  await expect(featured.locator('h3')).toHaveText(name);
  await page.getByRole('link', { name: 'Open Characters' }).click();
  await expect(caption).toHaveAttribute('data-identity-travelling', '');
  expect(await heading.evaluate(el => el.getAnimations().length)).toBe(1);
  await expect(caption).toHaveCSS('clip-path', /^inset\(/);
  await expect(caption).not.toHaveAttribute('data-identity-travelling', '');
  await expect(caption).toHaveAttribute('data-scroll-all', '');
  expect(await heading.evaluate(nameGeometry)).toMatchObject({ wraps: true, fitsWidth: true, fitsHeight: true, overflow: 'visible' });
  await page.getByRole('link', { name: 'Grand Index' }).click();
  await expect(featured).toHaveAttribute('data-identity-travelling', '');
  await expect(featured).not.toHaveAttribute('data-identity-travelling', '');
  expect(await featured.locator('h3').evaluate(nameGeometry)).toMatchObject({ wraps: true, fitsWidth: true, overflow: 'visible' });
});
