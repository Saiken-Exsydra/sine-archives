import { expect, test } from './browser';

test('the home viewport snaps in both directions and ends at the Grand Index', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('sine.awakening.v1', '1'));
  await page.goto('/');
  const entrance = page.locator('.awakening-hero');
  const index = page.locator('#archive-index');
  const alignment = () => index.evaluate(section => {
    const { top, bottom } = section.getBoundingClientRect();
    return [top, bottom - innerHeight, document.documentElement.scrollHeight - innerHeight - scrollY];
  });
  await expect(entrance).toBeInViewport({ ratio: 1 });
  await expect(page.locator('footer')).toHaveCount(0);
  await expect(page.locator('html')).toHaveCSS('scrollbar-width', 'none');

  await page.mouse.move(36, 260);
  await page.mouse.wheel(0, 600);
  await expect.poll(alignment).toEqual([0, 0, 0]);
  await page.mouse.wheel(0, 1000);
  await expect.poll(alignment).toEqual([0, 0, 0]);

  for (const [width, height] of [[844, 390], [390, 580]]) {
    await page.setViewportSize({ width, height });
    await expect.poll(alignment).toEqual([0, 0, 0]);
    await index.focus();
    for (const [key, domain] of [['ArrowLeft', 'systems'], ['ArrowRight', 'characters'], ['ArrowRight', 'history']]) {
      await page.keyboard.press(key);
      await expect(index).toHaveAttribute('data-domain', domain);
      await expect.poll(alignment).toEqual([0, 0, 0]);
    }
    await page.keyboard.press('ArrowLeft');
  }

  await page.keyboard.press('PageUp');
  await expect(entrance).toBeInViewport({ ratio: 1 });
  await page.getByRole('link', { name: 'Português (BR)', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-br');
  await page.keyboard.press('PageDown');
  await expect.poll(alignment).toEqual([0, 0, 0]);
});

test('edge previews expose the adjacent room and continue into a selection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#archive-index');
  const index = page.locator('#archive-index');
  const history = page.locator('.history-exhibit');
  await expect(index).toBeFocused();
  await expect(index).toBeInViewport({ ratio: .99 });
  await expect.poll(() => index.evaluate(el => el.getBoundingClientRect().top)).toBe(0);
  const y = await page.evaluate(() => scrollY);
  const left = () => history.evaluate(el => el.getBoundingClientRect().left);
  const edge = page.getByRole('button', { name: 'Show History' });
  await edge.hover();
  await expect.poll(left).toBeLessThan(1360);
  await expect(index).toHaveAttribute('data-domain', 'characters');
  await page.mouse.move(720, 460);
  await expect.poll(left).toBeGreaterThan(1439);
  await edge.hover();
  await edge.click();
  await expect.poll(left).toBeCloseTo(0, 0);
  expect(await page.evaluate(() => scrollY)).toBe(y);
  await expect(page.getByRole('link', { name: 'Open Characters' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Open History' }).click();
  await expect(page.getByRole('heading', { name: 'History', exact: true })).toBeFocused();
  await expect(page.locator('footer')).toBeVisible();
  await page.goBack();
  await expect(index).toHaveAttribute('data-domain', 'history');
});

test('phone swipe, reduced motion and direct domain entries', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=pt-br#archive-index');
  const index = page.locator('#archive-index');
  await expect(index).toHaveAttribute('data-domain', 'characters');
  await expect(index).toBeInViewport({ ratio: 1 });
  await page.locator('.character-exhibit .scene-art').evaluate(img => (img as HTMLImageElement).decode());
  await page.screenshot({ path: 'test-results/react-review/grand-index-phone.png' });
  const input = await page.context().newCDPSession(page);
  const swipeVertically = async (from: number, to: number) => {
    await input.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 70, y: from }] });
    for (const fraction of [.25, .5, .75, 1]) {
      await input.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 70, y: from + (to - from) * fraction }] });
      // Pace the touch samples so Chromium completes a native drag and snap.
      await page.waitForTimeout(80);
    }
    await input.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipeVertically(150, 760);
  await expect(page.locator('.awakening-hero')).toBeInViewport({ ratio: 1 });
  await swipeVertically(760, 150);
  await expect(index).toBeInViewport({ ratio: 1 });
  await expect(index).toHaveAttribute('data-domain', 'characters');

  await input.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y: 560 }] });
  await input.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 130, y: 570 }] });
  await input.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(index).toHaveAttribute('data-domain', 'history');
  await expect(index).toBeInViewport({ ratio: 1 });
  await expect(page.locator('.domain-track')).toHaveCSS('transition-duration', '0s');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.keyboard.press('ArrowLeft');
  await page.getByRole('link', { name: 'Explorar personagens' }).click();
  await expect(page.getByRole('heading', { name: 'Personagens' })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Le’nore Voren Engelmeyer' })).toBeVisible();
});
