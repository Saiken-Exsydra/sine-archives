import { gotoReady } from "./helpers/navigation";
import { expect, test } from "@playwright/test";

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
