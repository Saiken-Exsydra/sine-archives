import { test, expect } from '@playwright/test';

test('Systems opens into Redactory and Anchor with history and deep links', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/systems');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three ways to touch reality.');
  await page.locator('.system-portal').filter({ hasText: 'Redactory' }).click();
  await expect(page).toHaveURL(/#\/systems\/redactory$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Redactory');
  await page.getByRole('link', { name: /Examine the Anchor/ }).click();
  await expect(page).toHaveURL(/#\/systems\/redactory\/anchor$/);
  await expect(page.locator('.measures dt')).toHaveText(['01Anchor Depth', '02Dive Depth', '03Reach']);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A point of reference.');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Redactory');
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A point of reference.');
  expect(errors).toEqual([]);
});

test('all three public systems can be selected without leaving the React app', async ({ page }) => {
  await page.goto('/#/systems');
  for (const name of ['Divination', 'Bloom', 'Redactory']) {
    await page.locator('.system-portal').filter({ hasText: name }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(page.locator('.reading-pane .body-copy')).not.toBeEmpty();
  }
  await page.goto('/#/systems/bloom/anchor');
  await expect(page.getByText('This path is not part of the archive yet.')).toBeVisible();
  await page.getByRole('link', { name: '← All systems', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three ways to touch reality.');
});

test('Portuguese content and locale switching preserve the selected path', async ({ page }) => {
  await page.goto('/?lang=pt-br#/systems/redactory/anchor');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-br');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Um ponto de referência.');
  await expect(page.locator('.reading-pane .lead')).toContainText('Todo Redactor tem');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/lang=en#\/systems\/redactory\/anchor$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A point of reference.');
});

test('navigation is keyboard accessible and stays usable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/systems');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/#\/systems$/);
  await page.locator('.system-portal').filter({ hasText: 'Redactory' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.getByRole('link', { name: /Examine the Anchor/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A point of reference.');
  expect(await page.locator('.portal-art').first().evaluate(el => getComputedStyle(el).transform)).toBe('none');
});

test('layout fits small phones and wide desktops, including expanded content', async ({ page }, testInfo) => {
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['systems', 'systems/redactory', 'systems/redactory/anchor']) {
      await page.goto(`/#/${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.archive-app')).toHaveAttribute('data-motion', 'settled');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      expect(overflow, `${width}px / ${route}`).toBe(false);
      await expect(page.locator('.system-portal')).toHaveCount(3);
      expect(await page.locator('.system-field').evaluate(field => {
        const bounds = field.getBoundingClientRect();
        return Array.from(field.querySelectorAll('.system-portal')).every(portal => {
          const box = portal.getBoundingClientRect();
          return box.left >= bounds.left - 1 && box.right <= bounds.right + 1 && box.top >= bounds.top - 1 && box.bottom <= bounds.bottom + 1;
        });
      }), `Portals stay inside their field at ${width}px / ${route}`).toBe(true);
      if (testInfo.project.name === 'chromium' && ((width === 1440 && route !== 'systems/redactory') || (width === 390 && route === 'systems/redactory/anchor'))) {
        await page.screenshot({ path: `test-results/react-review/${width}-${route.replaceAll('/', '-')}.png`, fullPage: true });
      }
    }
  }
});

test('rapid navigation and live reduced-motion changes settle cleanly', async ({ page }) => {
  await page.goto('/#/systems');
  await page.locator('.system-portal').filter({ hasText: 'Redactory' }).click();
  await page.getByRole('link', { name: /Examine the Anchor/ }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goBack();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Three ways to touch reality.');
  await expect(page.locator('.system-portal').first()).toBeVisible();
});
