import { expect, test } from './helpers/test';
import { gotoReady } from './helpers/navigation';

test('archive records stay readable without reveal enhancement', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [route, selector] of [['/organizations/', '.org-spread__title'], ['/cosmology/', '.cosmo-panel__title']]) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(selector).first()).toHaveCSS('opacity', '1');
    await expect(page.locator(selector).first()).toBeVisible();
  }
  const secondary = page.locator('#cosmo-others-list a');
  if (await secondary.count()) await expect(secondary.first()).toBeVisible();
  await page.goto('/characters/');
  await expect(page.locator('.characters-fallback a').first()).toBeVisible();
  await expect(page.locator('.characters-fallback a').first()).toHaveAttribute('href', /\/characters\/.+\//);
  await page.goto('/places/');
  await expect(page.locator('.places-fallback a').first()).toBeVisible();
  await context.close();
});

test('a later navigation wins over a Redactory object action', async ({ page, browserName }) => {
  if (browserName === 'chromium') {
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  for (let sample = 0; sample < 4; sample++) {
    await gotoReady(page, '/systems/redactory/');
    await page.locator('[data-redactor-quill]').evaluate((link: HTMLAnchorElement) => link.click());
    await page.locator('.nav__logo').evaluate((link: HTMLAnchorElement) => link.click());
    await expect(page).toHaveURL('/');
    // Cover the former redirect delay and overlapping stylesheet preparation.
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL('/');
    await expect(page.locator('html')).toHaveClass(/is-page-ready/);
  }
});

test('closed Atlas dossier is inert and closing returns keyboard focus', async ({ page }) => {
  await gotoReady(page, '/places/map/');
  const panel = page.locator('#dossier');
  await expect(panel).toHaveAttribute('inert', '');
  await page.locator('#fullscreenBtn').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#dossierClose')).not.toBeFocused();
  const region = page.locator('.handle').first();
  await region.focus();
  await page.keyboard.press('Enter');
  await expect(panel).not.toHaveAttribute('inert', '');
  await page.locator('#dossierClose').focus();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveAttribute('inert', '');
  await expect(region).toBeFocused();
});

test('Systems addendums contain focus and release the page when closed', async ({ page }) => {
  await gotoReady(page, '/systems/');
  const panel = page.locator('#sys-overlay');
  await expect(panel).toHaveAttribute('inert', '');
  const opener = page.locator('#sys-entries-open');
  await opener.click();
  await expect(page.locator('#sys-entries-close')).toBeFocused();
  await expect(page.locator('#site-shell')).toHaveAttribute('inert', '');
  await page.keyboard.press('Shift+Tab');
  expect(await panel.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(panel).toHaveAttribute('inert', '');
  await expect(opener).toBeFocused();
  await expect(page.locator('#site-shell')).not.toHaveAttribute('inert', '');
});

test('character selection commits immediately and live reduced motion stops pointer depth', async ({ page }) => {
  await gotoReady(page, '/characters/');
  const second = page.locator('.sidebar__item').nth(1);
  const name = await second.locator('.sidebar__item-name').innerText();
  await second.evaluate((button: HTMLButtonElement) => button.click());
  expect((await page.locator('#stage-name').innerText()).trim()).toBe(name.trim());
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(1100, 650);
  await expect(page.locator('#stage-img')).toHaveCSS('transform', 'none');
  await expect(page.locator('#stage-gallery-play')).toHaveAttribute('aria-pressed', 'false');
});

test('the artwork overlay can be hidden and restored with the keyboard', async ({ page }) => {
  await gotoReady(page, '/characters/');
  const toggle = page.locator('#btn-stage-ui-toggle');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toBeFocused();
  await expect(page.locator('#stage-actions')).toHaveAttribute('inert', '');
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#stage-actions')).not.toHaveAttribute('inert', '');
});

test('dossier imagery is manual by default and playback can remain paused', async ({ page }) => {
  await gotoReady(page, '/characters/ella-wonderwall/');
  const play = page.locator('[data-portrait-play]');
  const slides = page.locator('[data-portrait-slide]');
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  await page.clock.install();
  await page.clock.fastForward(11000);
  await expect(slides.first()).toHaveAttribute('data-state', 'active');
  await page.locator('[data-portrait-next]').click();
  await page.clock.fastForward(1000);
  await expect(slides.nth(1)).toHaveAttribute('data-state', 'active');
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  await play.click();
  await expect(play).toHaveAttribute('aria-pressed', 'true');
  await page.clock.fastForward(6000);
  await page.clock.fastForward(1000);
  await expect(slides.first()).toHaveAttribute('data-state', 'active');
  await play.click();
  await page.clock.fastForward(11000);
  await expect(slides.first()).toHaveAttribute('data-state', 'active');
  await expect(play).toHaveAttribute('aria-pressed', 'false');
});

test('reduced motion composes every affected page without spatial entrances', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [route, selector] of [
    ['/', '.hero__bg-wrap'], ['/apparatus/', '.reg-entry'], ['/cosmology/', '.cosmo-panel__title'],
  ]) {
    await gotoReady(page, route);
    await expect(page.locator(selector).first()).toHaveCSS('animation-name', 'none');
    await expect(page.locator(selector).first()).toHaveCSS('transform', 'none');
  }
  await gotoReady(page, '/places/map/');
  await page.locator('.handle').first().click();
  expect(await page.locator('.map-transform').evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s');
});

test('Search cannot persist a pending query onto a different route', async ({ page }) => {
  await gotoReady(page, '/');
  await gotoReady(page, '/search/');
  await page.locator('#archive-search-input').fill('moon');
  await page.locator('.nav__logo').evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL('/');
  await page.waitForTimeout(150);
  await expect(page).toHaveURL('/');
});

test('Search exposes only the selected artwork and the actual result state', async ({ page }) => {
  await gotoReady(page, '/search/');
  await expect(page.locator('[data-search-primary-card]:visible')).toHaveCount(1);
  await expect(page.locator('#archive-search-empty')).toBeHidden();
  await expect(page.locator('#archive-search-clear')).toBeHidden();
  await page.locator('[data-search-filter="cosmology"]').click();
  await expect(page.locator('[data-search-primary-card]:visible')).toHaveAttribute('data-section', 'cosmology');
  await page.locator('#archive-search-input').fill('zzxmissingarchive987');
  await expect(page.locator('#archive-search-empty')).toBeVisible();
  await expect(page.locator('[data-search-primary-card]:visible')).toHaveCount(0);
  await expect(page.locator('[data-search-featured-card]:visible')).toHaveCount(0);
  await expect(page.locator('[data-search-remaining-row]:visible')).toHaveCount(0);
  await page.locator('#archive-search-clear').click();
  await expect(page.locator('#archive-search-empty')).toBeHidden();
  await expect(page.locator('[data-search-primary-card]:visible')).toHaveCount(1);
  await page.locator('[data-search-filter="all"]').click();
  const record = await page.locator('#archive-search-data').evaluate(node =>
    JSON.parse(node.textContent || '{}').items.slice(5).find((item: { image: unknown }) => item.image)
  );
  await page.locator('#archive-search-input').fill(record.title);
  const primary = page.locator('[data-search-primary-card]:visible');
  await expect(primary).toHaveAttribute('data-item-id', record.id);
  await expect(primary.locator('h2')).toHaveText(record.title);
  await expect(primary.locator('a')).toHaveAttribute('href', record.href);
  await expect(primary.locator('img')).toHaveAttribute('src', record.image.fallbackSrc);
  await expect(primary.locator('picture')).toHaveCSS('display', 'block');
  await expect(primary.locator('img')).toHaveCSS('object-fit', 'cover');
  await page.locator('#archive-search-clear').click();
  const lastRecord = page.locator('[data-search-remaining-row]:not([hidden]) a').last();
  await lastRecord.focus();
  await expect(lastRecord).toBeFocused();
  await expect(lastRecord).toBeInViewport();
});

test('decorative CSS activity pauses outside its stage', async ({ page }) => {
  await gotoReady(page, '/organizations/');
  const lastGrain = page.locator('.org-spread__img-grain').last();
  await expect(lastGrain).toHaveAttribute('data-motion-paused', '');
  await expect(lastGrain).toHaveCSS('animation-play-state', 'paused');
  await lastGrain.scrollIntoViewIfNeeded();
  await expect(lastGrain).not.toHaveAttribute('data-motion-paused', '');
});

test('synthesized touch selects characters and recovers from a canceled swipe', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP touch synthesis is Chromium-only; other engines cover layout and keyboard.');
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await gotoReady(page, '/characters/');
  const client = await context.newCDPSession(page);
  const firstName = await page.locator('#stage-name').innerText();
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: 260 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 90, y: 260 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.locator('#stage-name')).not.toHaveText(firstName);
  const selectedName = await page.locator('#stage-name').innerText();
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: 260 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(page.locator('#stage-name')).toHaveText(selectedName);
  await page.locator('.filmstrip__item').nth(3).click();
  await expect(page.locator('.filmstrip__item').nth(3)).toHaveClass(/is-active/);
  await context.close();
});
