import { test, expect } from '@playwright/test';
import { gotoReady } from './helpers/navigation';

const map = '/systems/observatory/';
const node = (id: string) => `[data-system-node="${id}"]`;

test('seam can be interrupted; Redactory concepts retain browser history and definitions', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await gotoReady(page, map);
  const root = page.locator('[data-observatory-root]');
  await expect(root).toHaveAttribute('data-controller', 'ready');
  await page.locator(node('redactory')).focus();
  await page.keyboard.press('Enter');
  await expect(root).toHaveAttribute('data-entrance', 'complete');
  await expect(root).toHaveAttribute('data-state', 'redactory');
  await expect(page.locator('[data-concept-nodes] a')).toHaveCount(4);
  await page.locator('[data-concept-nodes] [data-concept-ref="anchor"]').click();
  await expect(page).toHaveURL(/#redactory\/anchor$/);
  await expect(page.locator('#observatory-page-title')).toHaveText('Anchor');
  await expect(page.locator('#observatory-page-title')).toBeFocused();
  await page.locator('[data-definition-id="point"]').click();
  await expect(page.locator('[data-definition]')).toBeVisible();
  await expect(page.locator('[data-definition-body]')).toContainText('does not enter the Dive');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-definition]')).not.toBeVisible();
  await expect(page.locator('[data-definition-id="point"]')).toBeFocused();
  await page.goBack();
  await expect(root).toHaveAttribute('data-state', 'redactory');
  await page.goForward();
  await expect(page.locator('#observatory-page-title')).toHaveText('Anchor');
  await page.locator('[data-concept-ref="reach"]').click();
  await expect(page).toHaveURL(/#redactory\/anchor\/reach$/);
  await expect(page.locator('[data-concept-lineage] a')).toHaveText(['Redactory', 'Anchor', 'Reach']);
  await page.goBack();
  await expect(page.locator('#observatory-page-title')).toHaveText('Anchor');
  await expect(root).toHaveAttribute('data-navigation-intent', 'concept-close');
  expect(errors).toEqual([]);
});

test('relationships travel across systems and full interfaces remain reachable', async ({ page }) => {
  await gotoReady(page, `${map}#redactory`);
  await page.locator('[data-related-system="resonance"]').click();
  await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-navigation-intent', 'system-to-system');
  await expect(page).toHaveURL(/#resonance$/);
  await page.locator('[data-relationships-toggle]').click();
  await page.locator('button[data-relationship="redactory-resonance"]').click();
  await expect(page.locator('[data-relationship-detail]')).toContainText('passive mutual pressure');
  await page.locator('[data-system-panel-link]').click();
  await expect(page.locator('[data-system-interface="resonance"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-state', 'resonance');
  await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-entrance', 'complete');
});

test('deep links, rapid selection, archive and comparison', async ({ page }) => {
  await gotoReady(page, `${map}#redactory/anchor/reach`);
  await expect(page.locator('#observatory-page-title')).toHaveText('Reach');
  for (const id of ['bloom', 'shores', 'harmonics', 'redactory']) await page.locator(node(id)).click();
  await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-state', 'redactory');
  await page.locator('[data-archive-node]').click();
  await expect(page.locator('[data-page-body]')).toContainText('not a place');
  await page.locator('[data-compare-toggle]').click();
  await page.locator(node('redactory')).focus(); await page.keyboard.press('Space');
  await expect(page.locator(node('redactory'))).toHaveAttribute('aria-pressed', 'true');
  await page.locator(node('resonance')).click();
  await expect(page.locator('[data-relationship-detail]')).toContainText('Redactory is directed routing');
});

test('repeated client entry maintains one controller and canvas loop', async ({ page }) => {
  await page.addInitScript(() => {
    const records = new Map<HTMLCanvasElement, number>();
    (window as any).__canvasPaints = records;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.matches('[data-archive-field]')) records.set(this.canvas, (records.get(this.canvas) || 0) + 1);
      return clear.apply(this, args);
    };
  });
  await gotoReady(page, map);
  for (let i = 0; i < 3; i++) {
    await page.locator(node('redactory')).click();
    await page.locator('[data-system-panel-link]').click();
    await expect(page.locator('.redactory-desk')).toBeVisible();
    const before = await page.evaluate(() => [...(window as any).__canvasPaints.values()]);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => [...(window as any).__canvasPaints.values()])).toEqual(before);
    await page.goBack();
    await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-controller', 'ready');
    await expect(page.locator('[data-archive-field]')).toHaveCount(1);
    await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-canvas-loops', '1');
    expect(await page.evaluate(() => [...(window as any).__sineTransitionState.cleanups.keys()].filter((k: string) => k.includes('systems-observatory')).length)).toBe(1);
  }
});

test('all six systems expose sourced concepts and the entrance settles unaided', async ({ page }) => {
  await gotoReady(page, map);
  await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-entrance', 'complete');
  for (const id of ['redactory', 'resonance', 'harmonics', 'divination', 'bloom', 'shores']) {
    await page.locator(node(id)).click();
    await page.locator('[data-concept-nodes] a').first().click();
    await expect(page.locator('[data-page-body] .observatory-page__footer a')).toHaveAttribute('href', /\/systems\//);
  }
});

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`responsive reduced-motion exploration at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoReady(page, map);
    await page.locator(node('redactory')).click();
    await page.locator('[data-concept-nodes] [data-concept-ref="anchor"]').click();
    await expect(page.locator('#observatory-page-title')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator('[data-definition-id="point"]').click();
    const box = await page.locator('[data-definition]').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-definition]')).not.toBeVisible();
  });
}

test('Portuguese uses localized controls and destinations', async ({ page }) => {
  await gotoReady(page, '/pt-br/systems/observatory/#redactory/anchor');
  await expect(page.locator('.observatory-return')).toContainText('Voltar');
  await expect(page.locator('[data-page-body]')).toContainText('rota conceitual');
  await expect(page.locator('[data-page-body] .observatory-page__footer a')).toHaveAttribute('href', '/pt-br/systems/redactorysystem/');
});


test('interrupting relationship travel reconciles the marker and path', async ({ page }) => {
  await gotoReady(page, `${map}#redactory`);
  await page.locator('[data-related-system="resonance"]').click();
  await page.waitForTimeout(100);
  // Deliberately bypass actionability's animation wait to exercise a real interruption.
  await page.locator(node('bloom')).dispatchEvent('click');
  await expect(page.locator('[data-observatory-root]')).toHaveAttribute('data-state', 'bloom');
  await expect(page.locator('[data-travel-point]')).toHaveCSS('opacity', '0');
  await expect.poll(() => page.locator('[data-relationship-path]').evaluateAll(paths => paths.every(path => !(path as SVGElement).style.strokeDashoffset))).toBe(true);
});


test('observation isolates sourced relationships and Archive answers across the graph', async ({ page }) => {
  await gotoReady(page, map + '#map');
  await page.locator(node('redactory')).focus();
  await expect(page.locator('[data-svg-connector="redactory"]')).toHaveCSS('opacity', '0.85');
  await expect(page.locator('[data-relationship-path="redactory-resonance"]')).toHaveCSS('opacity', '0.32');
  await expect(page.locator(node('bloom'))).toHaveCSS('opacity', '0.32');
  await page.locator('[data-archive-node]').focus();
  await expect(page.locator('[data-svg-connector].is-hovered')).toHaveCount(6);
  await expect(page.locator('[data-relation-pulses] path')).toHaveCount(6);
  await expect(page.locator('[data-relation-pulses] path')).toHaveCount(0);
  await page.locator('[data-follow-toggle]').focus();
  await expect(page.locator(node('bloom'))).toHaveCSS('opacity', '1');
});

test('guided tracing, optional art and comparison keep their context', async ({ page }) => {
  await gotoReady(page, map + '#map');
  await page.locator('[data-follow-toggle]').click();
  await expect(page.locator('[data-follow-guide]')).toContainText('Choose a system');
  await page.locator(node('redactory')).click();
  await expect(page.locator('[data-follow-guide]')).toContainText('Follow a concept');
  await expect(page.locator('[data-page-body] .observatory-image img')).toHaveAttribute('alt', /ornate pen/);
  await page.locator('[data-concept-nodes] [data-concept-ref="anchor"]').click();
  await expect(page.locator('[data-page-body] .observatory-image')).toHaveCount(0);
  await page.locator('[data-compare-toggle]').click();
  await page.locator(node('redactory')).focus(); await page.keyboard.press('Space');
  await page.locator(node('resonance')).focus(); await page.keyboard.press('Space');
  await expect(page.locator('[data-comparison-plates] h2')).toHaveText(['Redactory', 'Resonance']);
  await expect(page.locator(node('redactory'))).toHaveCSS('opacity', '1');
  await expect(page.locator(node('resonance'))).toHaveCSS('opacity', '1');
  await expect.poll(() => page.locator(node('bloom')).evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(.4);
  await page.locator(node('resonance')).click();
  await expect(page.locator('[data-comparison-plates] h2')).toHaveCount(1);
  await expect(page.locator('[data-relationship-detail]')).toBeEmpty();
  await page.keyboard.press('Escape');
  await expect(page.locator('#observatory-page-title')).toHaveText('Anchor');
  await expect(page.locator('[data-compare-toggle]')).toBeFocused();
  await page.locator('[data-relationships-toggle]').click();
  await page.locator('button[data-relationship="bloom-shores"]').click();
  await page.keyboard.press('Escape');
  await page.locator('[data-relationships-toggle]').click();
  await expect(page.locator('[data-relationship-detail]')).toBeEmpty();
  await expect(page.locator('button[data-relationship="bloom-shores"]')).toHaveAttribute('aria-pressed', 'false');
});

test('reduced motion suppresses new travel and proximity while retaining relation selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gotoReady(page, map + '#map');
  await page.locator(node('redactory')).hover();
  await expect(page.locator('[data-relation-pulses] path')).toHaveCount(0);
  const before = await page.locator('[data-depth-layer]').evaluate(el => getComputedStyle(el).transform);
  await page.mouse.move(1100, 400); await page.waitForTimeout(150);
  expect(await page.locator('[data-depth-layer]').evaluate(el => getComputedStyle(el).transform)).toBe(before);
  await page.locator('[data-relationships-toggle]').click();
  await page.locator('button[data-relationship="bloom-shores"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-relationship-detail]')).toContainText('root-address');
});
