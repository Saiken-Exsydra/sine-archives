import { expect, test } from './browser';

for (const [width, height] of [[1440, 900], [2400, 900], [390, 844]]) {
  test(`both individuals retain their environment through examination at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const id of ['lenore-engelmeyer', 'hisui-kirasagi']) {
      const pt = id === 'hisui-kirasagi';
      await page.goto('/?lang=' + (pt ? 'pt-br' : 'en') + '#/characters/' + id);
      const hero = page.locator('.character-exhibit .scene-art');
      await hero.evaluate((image: HTMLImageElement) => image.decode());
      const original = await hero.elementHandle();
      const bounds = await hero.boundingBox();
      const source = await hero.evaluate((image: HTMLImageElement) => image.currentSrc);
      await expect(page.locator('.affiliation-insignia:visible')).toHaveText(pt ? /Serviço doméstico/ : /Blood lineage/);
      await expect(page.locator('.affiliation-insignia img')).toHaveCount(0);
      const tabs = page.getByRole('tab');
      await tabs.first().focus();
      for (const key of ['ArrowDown', 'ArrowDown', 'End', 'Home']) await page.keyboard.press(key);
      await expect(tabs.first()).toBeFocused();
      const summary = page.locator('.archival-insignia summary').first();
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('details[open] a')).toHaveAttribute('href', '#/systems/' + (pt ? 'bloom' : 'redactory'));
      await page.keyboard.press('Space');
      for (const [index, section] of ['overview', 'biography', 'abilities', 'relations'].entries()) {
        await tabs.nth(index).click();
        await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('.examination-content')).toHaveCount(1);
        await expect(page.locator('.examination-content')).toHaveCSS('opacity', '1');
        await page.mouse.move(0, 0);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({path: `test-results/phase-v/${id}-${width}-${section}.png`});
        expect(await hero.evaluate((el, prev) => el === prev, original)).toBe(true);
        expect(await hero.boundingBox()).toEqual(bounds);
        expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toBe(source);
        expect(await page.getByRole('tabpanel').evaluate(el => el.clientHeight)).toBeGreaterThan(60);
      }
      await page.goBack();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
      if (pt) await expect(page.locator('.archival-insignia')).not.toContainText('Anchor');
    }
  });
}
