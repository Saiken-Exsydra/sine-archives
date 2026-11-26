import { test, expect } from './browser';
import type { Page } from '@playwright/test';

const hero = '.character-exhibit .scene-art';
const hisui = '**/media/hisui-kirasagi-hero-*.webp';

async function sectionGeometry(page: Page) {
  const art = page.locator(hero);
  const original = await art.elementHandle();
  const inspect = () => art.evaluate((image: HTMLImageElement) => ({
    box: image.getBoundingClientRect().toJSON(), source: image.currentSrc,
    fit: getComputedStyle(image).objectFit, position: getComputedStyle(image).objectPosition,
    transform: getComputedStyle(image).transform,
  }));
  const first = await inspect();
  for (const name of ['Biography', 'Abilities', 'Relations', 'Overview']) {
    await page.getByRole('tab', { name }).click();
    expect(await art.evaluate((image, initial) => image === initial, original)).toBe(true);
    expect(await inspect()).toEqual(first);
  }
  return first;
}

for (const [width, height, dpr, heroWidth, portraitWidth] of [
  [1440, 900, 1, 1920, 96], [390, 844, 2, 1280, 320],
]) {
  test.describe(`publication at ${width}px and DPR ${dpr}`, () => {
    test.use({ viewport: { width, height }, deviceScaleFactor: dpr });
    test('requests one candidate per slot and keeps the environment across all tabs', async ({ page }) => {
      const files: string[] = [];
      page.on('request', request => {
        if (request.url().includes('/media/')) files.push(request.url().split('/').pop()!);
      });
      await page.goto('/#/characters');
      const art = page.locator(hero);
      await art.evaluate((img: HTMLImageElement) => img.decode());
      const portrait = page.locator('.individuals img').first();
      await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      expect(await portrait.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain('portrait-' + portraitWidth + '-');
      expect(await portrait.getAttribute('loading')).toBe('lazy');
      const geometry = await sectionGeometry(page);
      expect(geometry.source).toContain('hero-' + heroWidth + '-');
      expect(geometry.fit).toBe('cover');
      expect(geometry.position).toBe(width > 700 ? '42% 28%' : '39% 20%');
      expect(files.filter(file => file.includes('-hero-'))).toHaveLength(1);
      expect(new Set(files).size).toBe(files.length);
    });
  });
}

test('keeps the presented subject through network and decode waits and releases the outgoing layer', async ({ page }) => {
  let release!: () => void;
  const slow = new Promise<void>(resolve => { release = resolve; });
  await page.route(hisui, async route => { await slow; await route.fallback(); });
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function () {
      await decode.call(this);
      if (this.src.includes('hisui-kirasagi-hero')) {
        await new Promise<void>(resolve => { Object.assign(window, { releaseDecode: resolve }); });
      }
    };
  });
  await page.goto('/#/characters');
  await page.locator(hero).evaluate((img: HTMLImageElement) => img.decode());
  const requested = page.waitForRequest(hisui);
  await page.getByRole('link', { name: 'Hisui Kirasagi' }).click();
  await requested;
  const name = page.locator('.character-caption h3');
  await expect(name).toHaveText('Le’nore Voren Engelmeyer');
  await expect(page).toHaveTitle('Le’nore Voren Engelmeyer · SiNE Archives');
  await expect(page.locator(hero).first()).toHaveCSS('opacity', '1');
  await expect(page.locator(hero).last()).toHaveCSS('opacity', '0');
  release();
  await page.waitForFunction(() => 'releaseDecode' in window);
  await expect(name).toHaveText('Le’nore Voren Engelmeyer');
  await expect(page).toHaveTitle('Le’nore Voren Engelmeyer · SiNE Archives');
  await page.evaluate(() => (window as any).releaseDecode());
  await expect(name).toHaveText('Hisui Kirasagi');
  await expect(page.locator(hero)).toHaveCount(1);
  await expect(page.locator(hero)).toHaveCSS('opacity', '1');
});

test('back and leaving the exhibition supersede a pending selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function () {
      await decode.call(this);
      if (this.src.includes('hisui-kirasagi-hero')) {
        await new Promise<void>(resolve => { Object.assign(window, { finishPending: resolve }); });
      }
    };
  });
  await page.goto('/#/characters');
  for (const leave of [false, true]) {
    await page.getByRole('link', { name: 'Hisui Kirasagi' }).click();
    await page.waitForFunction(() => 'finishPending' in window);
    if (leave) await page.evaluate(() => { location.hash = '/history'; });
    else await page.goBack();
    await expect(page.locator(hero)).toHaveCount(leave ? 0 : 1);
    await page.evaluate(async () => {
      (window as any).finishPending();
      delete (window as any).finishPending;
      await new Promise(requestAnimationFrame);
    });
    if (!leave) await expect(page.locator('.character-caption h3')).toHaveText('Le’nore Voren Engelmeyer');
    else await expect(page).toHaveURL(/history$/);
  }
});

test('a resize during decode waits for the newly selected hero variant', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    const gates = new Map<string, () => void>();
    Object.assign(window, { gates });
    HTMLImageElement.prototype.decode = async function () {
      const src = this.currentSrc;
      await decode.call(this);
      if (src.includes('hisui-kirasagi-hero')) {
        await new Promise<void>(resolve => gates.set(src, resolve));
      }
    };
  });
  await page.goto('/#/characters');
  await page.getByRole('link', { name: 'Hisui Kirasagi' }).click();
  await page.waitForFunction(() => (window as any).gates.size === 1);
  await page.setViewportSize({ width: 2000, height: 900 });
  await page.waitForFunction(() => (window as any).gates.size === 2);
  await page.evaluate(() => Array.from((window as any).gates.values() as Iterable<() => void>)[0]());
  await expect(page.locator('.character-caption h3')).toHaveText('Le’nore Voren Engelmeyer');
  await page.evaluate(() => Array.from((window as any).gates.values() as Iterable<() => void>)[1]());
  await expect(page.locator('.character-caption h3')).toHaveText('Hisui Kirasagi');
  await expect(page.locator(hero)).toHaveCount(1);
  expect(await page.locator(hero).evaluate((img: HTMLImageElement) => img.currentSrc)).toContain('hero-2560-');
});

test('failed selected and direct heroes leave a readable localized record', async ({ page }) => {
  await page.route(hisui, route => route.abort());
  await page.goto('/?lang=pt-br#/characters');
  await page.getByRole('link', { name: 'Hisui Kirasagi' }).click();
  for (const reload of [false, true]) {
    if (reload) await page.reload();
    await expect(page.getByText('Ilustração indisponível.')).toBeVisible();
    await expect(page.locator(hero)).toHaveCount(0);
    await expect(page.locator('.character-caption h3')).toHaveText('Hisui Kirasagi');
    await page.getByRole('tab', { name: 'Biografia' }).click();
    await expect(page.getByRole('tabpanel')).toContainText('Tsukimiya');
  }
});
