import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/systems/redactory/",
  "/systems/redactory/dive/",
  "/systems/redactory/redactor/",
  "/systems/redactory/index-theorem/",
] as const;

function trackClientErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  return errors;
}

async function expectHealthyPage(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
}

test.describe("Redactory desktop flow", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("desk hotspots navigate and branch actions work", async ({ page }) => {
    const errors = trackClientErrors(page);

    await expectHealthyPage(page, routes[0]);
    await page.screenshot({ path: "test-results/redactory-desk-1440.png", fullPage: true });

    const papers = page.getByRole("link", { name: "Open the Index Theorem entry" });
    const quill = page.getByRole("link", { name: "Open the Redactor profile" });
    const inkpot = page.getByRole("link", { name: "Enter the Dive" });
    await expect(papers).toBeVisible();
    await expect(quill).toBeVisible();
    await expect(inkpot).toBeVisible();

    await papers.hover();
    await expect(papers.locator(".redactory-desk__papers-copy")).toBeVisible();
    await page.screenshot({ path: "test-results/redactory-desk-papers-hover-1440.png" });
    await papers.focus();
    await expect(papers).toBeFocused();
    await expect(papers.locator(".redactory-desk__papers-copy")).toHaveCSS("outline-style", "solid");
    await page.screenshot({ path: "test-results/redactory-desk-papers-focus-1440.png" });
    await papers.click();
    await page.waitForURL(/\/systems\/redactory\/index-theorem\/$/);
    await expect(page.getByText("Index Theorem", { exact: true }).last()).toBeVisible();
    await page.screenshot({ path: "test-results/redactory-theorem-1440.png", fullPage: true });
    await expect(page.getByRole("link", { name: /Meet the Redactor/i })).toHaveAttribute(
      "href",
      "/systems/redactory/redactor/",
    );
    await expect(page.getByRole("link", { name: /Enter the Dive/i }).last()).toHaveAttribute(
      "href",
      "/systems/redactory/dive/",
    );
    await expect(page.getByRole("link", { name: /Return to the Desk/i })).toHaveAttribute(
      "href",
      "/systems/redactory/",
    );

    await expectHealthyPage(page, routes[0]);
    await quill.click();
    await page.waitForURL(/\/systems\/redactory\/redactor\/$/);
    await expect(page.getByText("Redactor", { exact: true }).last()).toBeVisible();
    await page.screenshot({ path: "test-results/redactory-redactor-1440.png", fullPage: true });
    await page.getByRole("link", { name: /Study the Anchor/i }).click();
    await expect(page).toHaveURL(/\/systems\/redactory\/redactor\/#anchor$/);
    await expect(page.locator("#anchor")).toBeInViewport();

    await expectHealthyPage(page, routes[0]);
    await inkpot.click();
    await page.waitForURL(/\/systems\/redactory\/dive\/$/);
    await expect(page.getByText("Dive", { exact: true }).last()).toBeVisible();
    await page.screenshot({ path: "test-results/redactory-dive-1440.png", fullPage: true });

    expect(errors).toEqual([]);
  });
});

for (const viewport of [
  { name: "large", width: 1920, height: 1080 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`Redactory routes render at ${viewport.name}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    const errors = trackClientErrors(page);

    for (const path of routes) {
      await expectHealthyPage(page, path);
      const slug = path === routes[0] ? "desk" : path.split("/").filter(Boolean).at(-1);
      await page.screenshot({
        path: `test-results/redactory-${slug}-${viewport.width}.png`,
        fullPage: true,
      });
    }

    if (viewport.name === "mobile") {
      await expectHealthyPage(page, routes[0]);
      await expect(page.getByRole("link", { name: "Open the Index Theorem entry" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Open the Redactor profile" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Enter the Dive" })).toBeVisible();
      await page.getByRole("link", { name: "Open the Index Theorem entry" }).click();
      await page.waitForURL(/\/systems\/redactory\/index-theorem\/$/);
    }

    expect(errors).toEqual([]);
    await context.close();
  });
}

test("Redactory reduced motion navigates without delayed animation", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const errors = trackClientErrors(page);

  await expectHealthyPage(page, routes[0]);
  await page.getByRole("link", { name: "Enter the Dive" }).click();
  await page.waitForURL(/\/systems\/redactory\/dive\/$/);
  await expect(page.locator(".redactory-dive__inkwell span")).toHaveCSS("animation-name", "none");

  expect(errors).toEqual([]);
  await context.close();
});
