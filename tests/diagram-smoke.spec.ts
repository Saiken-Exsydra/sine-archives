import { expect, test } from "@playwright/test";

function trackClientErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

test("Markdown diagrams render as archive panels", async ({ page }) => {
  const errors = trackClientErrors(page);

  await page.goto("/systems/firmament/", { waitUntil: "networkidle" });

  await expect(page.locator(".codex-diagram").first()).toBeVisible();
  await expect(page.locator(".codex-diagram__label").first()).toHaveText("CODEX DIAGRAM");
  await expect(page.locator(".mermaid-diagram").first()).toBeVisible();
  await expect(page.locator(".mermaid-diagram svg").first()).toBeVisible();

  const ordinaryCodeBlocksAreUntouched = await page.evaluate(() => {
    const ordinaryCodeBlocks = Array.from(document.querySelectorAll("pre code"))
      .filter((code) => !code.closest(".codex-diagram, .mermaid-diagram"));

    return ordinaryCodeBlocks.every((code) => !code.closest(".codex-diagram"));
  });
  expect(ordinaryCodeBlocksAreUntouched).toBe(true);
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
  await expect(page.locator(".codex-diagram").first()).toBeVisible();
  await expect(page.locator(".mermaid-diagram svg").first()).toBeVisible();

  const bodyOverflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(bodyOverflows).toBe(false);
  expect(errors).toEqual([]);

  await context.close();
});
