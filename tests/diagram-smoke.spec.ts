import { expect, test } from "@playwright/test";

function trackClientErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

test("Markdown diagrams render as black-stage Mermaid panels", async ({ page }) => {
  const errors = trackClientErrors(page);

  await page.goto("/systems/firmament/", { waitUntil: "networkidle" });

  await expect(page.locator(".mermaid-diagram").first()).toBeVisible();
  await expect(page.locator(".mermaid-diagram__label").first()).toHaveText("Mermaid");
  await expect(page.locator(".mermaid-diagram svg").first()).toBeVisible();
  await expect(page.locator(".mermaid-diagram").first()).toHaveCSS("background-color", "rgb(0, 0, 0)");

  const ordinaryCodeBlocksAreUntouched = await page.evaluate(() => {
    const ordinaryCodeBlocks = Array.from(document.querySelectorAll("pre code"))
      .filter((code) => !code.closest(".codex-diagram, .mermaid-diagram"));

    return ordinaryCodeBlocks.every((code) => !code.closest(".codex-diagram"));
  });
  const mermaidNodeFills = await page.locator(".mermaid-diagram svg .node rect").first().evaluate((node) => {
    return getComputedStyle(node).fill;
  });

  expect(ordinaryCodeBlocksAreUntouched).toBe(true);
  expect(mermaidNodeFills).toBe("rgb(32, 32, 32)");
  expect(errors).toEqual([]);
});

test("Markdown diagrams contain overflow on mobile", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const errors = trackClientErrors(page);

  await page.goto("/systems/firmament/", { waitUntil: "networkidle" });
  await expect(page.locator(".mermaid-diagram svg").first()).toBeVisible();

  const bodyOverflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(bodyOverflows).toBe(false);
  expect(errors).toEqual([]);

  await context.close();
});
