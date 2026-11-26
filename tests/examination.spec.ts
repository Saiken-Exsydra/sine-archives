import { expect, test } from './browser';

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
      const summary = page.locator('.archival-insignia summary').first();
      await summary.focus();
      await page.keyboard.press('Enter');
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
