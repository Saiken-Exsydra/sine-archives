import type { Locator, Page } from '@playwright/test';
import { test, expect } from './browser';

const images = 'test-results/awakening';
const phase = (page: Page) => page.locator('.archive-home');
async function move(page: Page) {
  await page.mouse.move(21, 24);
  await page.mouse.move(44, 28);
}

test('a single impact drives the material and the ordered reveal', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:02Z'));
  await page.goto('/');
  await page.clock.runFor(4000);
  await expect(phase(page)).toHaveAttribute('data-phase', 'dormant');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.archive-title')).toHaveCSS('opacity', '0');
  await expect(page.locator('.archive-motto')).toHaveCSS('opacity', '0');
  await expect(page.getByRole('link')).toHaveCount(0);
  await page.screenshot({ path: images + '/01-dormant.png' });
  await page.dispatchEvent('body','pointermove',{ movementX: 50 });
  await expect(phase(page)).toHaveAttribute('data-phase', 'dormant');
  await move(page);
  await expect(phase(page)).toHaveAttribute('data-phase', 'awakening');
  await page.locator('.obsidian[data-renderer="webgl"]').waitFor();
  await page.clock.runFor(320);
  await page.screenshot({ path: images + '/02-impact.png' });
  await page.mouse.move(210,130);
  await page.clock.runFor(460);
  await page.screenshot({ path: images + '/03-propagation.png' });
  await expect(page.locator('.archive-title')).toHaveCSS('opacity','0');
  await page.clock.runFor(650);
  expect(await page.locator('.archive-title').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.5);
  await expect(page.locator('.archive-motto')).toHaveCSS('opacity', '0');
  await expect(page.locator('.home-masthead')).toHaveCSS('opacity','0');
  await page.screenshot({ path: images + '/04-wordmark.png' });
  await page.clock.runFor(1000);
  await expect(page.locator('.index-indicator')).toHaveCSS('opacity','0');
  expect(await page.locator('.archive-motto').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await page.clock.runFor(1150);
  await expect(phase(page)).toHaveAttribute('data-phase', 'manifested');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.archive-motto')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: images + '/05-desktop.png' });
  await move(page);
  await page.reload();
  await expect(phase(page)).toHaveAttribute('data-phase', 'manifested');
  await page.getByRole('link', { name:'INDEX', exact:true }).click();
  await page.clock.resume();
  await expect(page.locator('#archive-index')).toBeFocused();
  await expect(page.locator('#archive-index')).toBeInViewport({ratio:.95});
  await page.screenshot({ path: images + '/08-directory.png' });
  expect(errors).toEqual([]);
});

test('the material falls back and the archive completes without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null;
      return Reflect.apply(getContext,this,[type,...args]);
    } as typeof getContext;
  });
  await page.goto('/');
  await page.mouse.wheel(0,20);
  await expect(phase(page)).toHaveAttribute('data-phase','awakening');
  await expect(page.locator('.obsidian')).toHaveAttribute('data-renderer','fallback');
  await expect.poll(() => page.locator('.obsidian-reflection').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.55);
  await page.screenshot({ path: images + '/07-fallback.png' });
  await expect(phase(page)).toHaveAttribute('data-phase','manifested');
});

test('context loss, restoration and a live motion preference change share the same sequence', async ({ page }) => {
  await page.goto('/');
  await move(page);
  const surface = page.locator('.obsidian');
  await expect(surface).toHaveAttribute('data-renderer','webgl');
  await page.locator('canvas').evaluate(canvas => {
    const extension = canvas.getContext('webgl')!.getExtension('WEBGL_lose_context')!;
    canvas.addEventListener('webglcontextlost', () => setTimeout(() => extension.restoreContext(), 350), {once:true});
    extension.loseContext();
  });
  await expect(surface).toHaveAttribute('data-renderer','fallback');
  await expect(surface).toHaveAttribute('data-renderer','webgl');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(phase(page)).toHaveAttribute('data-phase','manifested');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('keyboard, deep links and disabled storage retain access', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Unavailable');}}));
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await expect(phase(page)).toHaveAttribute('data-phase','manifested');
  await page.getByRole('link',{name:'INDEX',exact:true}).click();
  await page.getByRole('button',{name:'Show Systems'}).click();
  await page.getByRole('link',{name:/Explore the systems/}).click();
  await page.goBack();
  await page.goBack();
  await expect(phase(page)).toHaveAttribute('data-phase','manifested');
  await page.goto('/?lang=pt-br#archive-index');
  await expect(page.locator('#archive-index')).toBeFocused();
  await expect(page.getByRole('link',{name:'ÍNDICE',exact:true})).toBeAttached();
  await page.getByRole('button',{name:'Mostrar Sistemas'}).click();
  await page.getByRole('link',{name:'Bloom',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('Bloom');
});

test('touch awakens the emblem and rotation preserves the composition', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const client = await page.context().newCDPSession(page);
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:55,y:100}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(phase(page)).toHaveAttribute('data-phase','awakening');
  await page.setViewportSize({width:844,height:390});
  await expect(page.locator('canvas')).toHaveCSS('width','844px');
  await page.setViewportSize({width:390,height:844});
  await expect(phase(page)).toHaveAttribute('data-phase','manifested');
  await page.screenshot({path:images+'/06-mobile.png'});
});

test('the emblem is centered across the six reference viewports', async ({ page }) => {
  await page.goto('/');
  for (const [width,height] of [[1920,1080],[2560,1440],[1440,900],[1366,768],[768,1024],[390,844]]) {
    await page.setViewportSize({width,height});
    const rect = await page.locator('.hero-emblem').boundingBox();
    expect(rect!.x + rect!.width/2).toBeCloseTo(width/2,0);
    expect(rect!.y + rect!.height/2).toBeCloseTo(height/2,0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('an interrupted visit replays and native fullscreen follows its actual state', async ({ page }) => {
  await page.goto('/');
  await move(page);
  await expect(phase(page)).toHaveAttribute('data-phase','awakening');
  await page.reload();
  await expect(phase(page)).toHaveAttribute('data-phase','dormant');
  await page.keyboard.press('Tab');
  const toggle = page.getByRole('button', { name: 'Fullscreen' });
  const icon = toggle.locator('path');
  const enterPath = await icon.getAttribute('d');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await expect(icon).not.toHaveAttribute('d', enterPath!);
  expect(await page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await page.keyboard.press('PageDown');
  const index = page.locator('#archive-index');
  await expect(index).toBeInViewport({ ratio: 1 });
  await page.evaluate(() => document.exitFullscreen());
  await expect(toggle).toHaveAttribute('aria-pressed','false');
  await expect(icon).toHaveAttribute('d', enterPath!);
  await expect(index).toBeInViewport({ ratio: 1 });
});

async function sampleLanguageSelection(option: Locator) {
  return option.evaluate(async link => {
    const masthead = link.closest('header')!;
    const insetBounds = () => masthead.querySelector('.locale-selection')!.getBoundingClientRect();
    const controls = Array.from(masthead.querySelectorAll('.wordmark img, .locale-selector, .fullscreen-control, .fullscreen-control svg'));
    const boxes = () => controls.map(control => control.getBoundingClientRect().toJSON());
    const fixed = boxes();
    const initial = insetBounds().toJSON();
    const target = link.getBoundingClientRect().toJSON();
    let shifted = false;
    const frames = [];
    (link as HTMLAnchorElement).click();

    const deadline = performance.now() + 1000;
    while (performance.now() < deadline) {
      await new Promise(requestAnimationFrame);
      const { x, width } = insetBounds();
      frames.push({ x, width });
      shifted ||= JSON.stringify(boxes()) !== JSON.stringify(fixed);
      if (Math.abs(x - target.x) < .25 && Math.abs(width - target.width) < .25) break;
    }

    return { initial, target, frames, shifted, fixed };
  });
}

test('the floating header stays aligned as the language inset slides and resizes', async ({ page }) => {
  await page.goto('/?lang=en');
  await page.keyboard.press('Tab');
  const selector = page.locator('.locale-selector');
  const inset = selector.locator('.locale-selection');
  const english = selector.getByRole('link', { name: /^English$/i });
  const portuguese = selector.getByRole('link', { name: /^Português \(BR\)$/i });
  await expect(page.locator('.home-masthead')).toHaveCSS('border-bottom-width', '0px');

  for (const [width, height] of [[1440, 900], [320, 720]]) {
    await page.setViewportSize({ width, height });
    await expect.poll(async () => Math.abs((await inset.boundingBox())!.width - (await english.boundingBox())!.width)).toBeLessThan(.5);
    for (const option of [portuguese, english]) {
      const { initial, target, frames, shifted, fixed: [logo, group, toggle, icon] } = await sampleLanguageSelection(option);
      expect(shifted).toBe(false);
      expect(toggle.width).toBe(group.height);
      expect(toggle.height).toBe(group.height);
      expect(toggle.y).toBe(group.y);
      expect(logo.y + logo.height / 2).toBeCloseTo(group.y + group.height / 2, 0);
      expect(icon.y + icon.height / 2).toBeCloseTo(toggle.y + toggle.height / 2, 0);
      expect(icon.x + icon.width / 2).toBeCloseTo(toggle.x + toggle.width / 2, 0);
      expect(frames.some(({ x, width }) =>
        x > Math.min(initial.x, target.x) + 1 && x < Math.max(initial.x, target.x) - 1 &&
        width > Math.min(initial.width, target.width) + 1 && width < Math.max(initial.width, target.width) - 1)).toBe(true);
      expect(frames.at(-1)!.x).toBeCloseTo(target.x, 0);
      expect(frames.at(-1)!.width).toBeCloseTo(target.width, 0);
      await expect(option).toHaveAttribute('aria-current', 'true');
    }
  }

  await selector.evaluate(async group => {
    const [en, pt] = group.querySelectorAll('a');
    for (const option of [pt, en, pt]) {
      option.click();
      await new Promise(requestAnimationFrame);
    }
  });
  await expect(portuguese).toHaveAttribute('aria-current', 'true');
  await expect.poll(async () => Math.abs((await inset.boundingBox())!.x - (await portuguese.boundingBox())!.x)).toBeLessThan(.5);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const instant = await sampleLanguageSelection(english);
  expect(instant.frames[0].x).toBeCloseTo(instant.target.x, 0);
  expect(instant.frames[0].width).toBeCloseTo(instant.target.width, 0);
  await english.focus();
  await page.keyboard.press('Tab');
  await expect(portuguese).toBeFocused();
  await expect(portuguese).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(portuguese).toBeFocused();
  await expect(portuguese).toHaveAttribute('aria-current', 'true');
});

test('hidden documents suspend updates and settle on return', async ({ page }) => {
  await page.goto('/');
  await move(page);
  await expect(phase(page)).toHaveAttribute('data-phase','awakening');
  await page.evaluate(() => {
    Object.defineProperty(document,'hidden',{configurable:true,value:true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.install();
  await page.clock.fastForward(4000);
  await expect(phase(page)).toHaveAttribute('data-phase','awakening');
  await page.evaluate(() => {
    Reflect.deleteProperty(document,'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(phase(page)).toHaveAttribute('data-phase','manifested');
});

