import { gotoReady } from "./helpers/navigation";
import { expect, test } from "./helpers/test";

for (const locale of ['', '/pt-br']) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale || 'en'} home section names remain readable with JavaScript ${javaScriptEnabled ? 'on' : 'off'}`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled });
      const page = await context.newPage();
      try {
        for (const width of [1440, 390]) {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(`${locale}/`);
          const rows = page.locator('.list-row');
          await expect(rows).toHaveCount(8);
          for (const reducedMotion of ['no-preference', 'reduce'] as const) {
            await page.emulateMedia({ reducedMotion });
            for (const row of await rows.all()) {
              // Playwright visibility alone deliberately allows opacity: 0.
              await expect(row).toHaveCSS('opacity', '1');
              await expect(row.locator('.list-row__label')).toHaveText(/\S/);
              await expect(row.locator('.list-row__count')).toHaveCSS('opacity', '1');
            }
          }
        }
        if (javaScriptEnabled) {
          await page.setViewportSize({ width: 1440, height: 900 });
          const first = page.locator('.list-row').first();
          await first.hover();
          await expect(page.locator('.preview-layer.is-active')).toHaveAttribute('data-key', 'characters');
          const second = page.locator('.list-row').nth(1);
          await second.focus();
          await expect(page.locator('.preview-layer.is-active')).toHaveAttribute('data-key', 'organizations');
        }
      } finally { await context.close(); }
    });
  }
}

test("home edge gates reveal by proximity without blocking page content", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await gotoReady(page, "/");

  const viewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const probeY = viewport.height / 2;
  const leftProbeX = viewport.width * 0.35;
  const rightProbeX = viewport.width * 0.65;

  const leftGate = page.locator('[data-edge-gate="left"]');
  const rightGate = page.locator('[data-edge-gate="right"]');
  const leftLabel = leftGate.locator(".observatory-gate__label");
  const rightLabel = rightGate.locator(".observatory-gate__label");

  await page.mouse.move(leftProbeX, probeY);
  await expect.poll(() => leftLabel.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeGreaterThan(0.2);
  await expect(rightLabel).toHaveCSS("opacity", "0");

  const leftDetectionTarget = await page.evaluate(({ x, y }) => {
    const target = document.elementFromPoint(x, y);
    return target?.closest("[data-edge-gate]")?.getAttribute("data-edge-gate") ?? null;
  }, { x: leftProbeX, y: probeY });
  expect(leftDetectionTarget).toBeNull();

  await page.mouse.move(viewport.width / 2, probeY);
  await expect(leftLabel).toHaveCSS("opacity", "0");
  await expect(rightLabel).toHaveCSS("opacity", "0");

  await page.mouse.move(rightProbeX, probeY);
  await expect.poll(() => rightLabel.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeGreaterThan(0.2);
  await expect(leftLabel).toHaveCSS("opacity", "0");

  const rightDetectionTarget = await page.evaluate(({ x, y }) => {
    const target = document.elementFromPoint(x, y);
    return target?.closest("[data-edge-gate]")?.getAttribute("data-edge-gate") ?? null;
  }, { x: rightProbeX, y: probeY });
  expect(rightDetectionTarget).toBeNull();

  await page.mouse.move(40, probeY);
  await expect(leftLabel).toHaveCSS("opacity", "1");
  await expect(leftGate).toHaveAttribute("href", "/systems/observatory/");

  await page.mouse.move(viewport.width - 40, probeY);
  await expect(rightLabel).toHaveCSS("opacity", "1");
  await expect(rightGate).toHaveAttribute("href", "/search/");
});
