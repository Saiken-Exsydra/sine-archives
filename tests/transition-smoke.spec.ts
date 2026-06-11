import { expect, test } from "@playwright/test";

const EXPECTED_EVENTS = [
  "astro:before-preparation",
  "astro:after-preparation",
  "astro:before-swap",
  "astro:after-swap",
  "astro:page-load",
] as const;

function trackClientErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

async function disableBrowserCache(page: import("@playwright/test").Page) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
}

async function waitForTransitionSequence(page: import("@playwright/test").Page) {
  await expect.poll(async () => {
    return page.evaluate((expected) => {
      const transitionState = (window as any).__sineTransitionState;
      const events = transitionState?.debugEvents?.map((entry: { event: string }) => entry.event) ?? [];
      return expected.every((event) => events.includes(event));
    }, EXPECTED_EVENTS);
  }).toBe(true);
}

async function openSearch(page: import("@playwright/test").Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await expect(page.locator(".nav__search-btn").first()).toBeVisible();

  await page.locator(".nav__search-btn").first().click();
  await page.waitForURL(/\/search\/?$/);
  await expect(page.locator("[data-search-root]")).toBeVisible();
  await expect(page.locator("#archive-search-input")).toBeFocused();

  const firstVisual = page.locator(".search-primary-card__visual").first();
  if (await firstVisual.count()) {
    await expect.poll(async () => {
      return firstVisual.evaluate((node) => node.classList.contains("is-loaded"));
    }).toBe(true);
  }

  await waitForTransitionSequence(page);
}

test("home to search first click and repeat stay healthy", async ({ page }) => {
  const errors = trackClientErrors(page);
  await disableBrowserCache(page);

  await openSearch(page, "/");

  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/$/);

  await openSearch(page, page.url());

  expect(errors).toEqual([]);
});

test("mobile reduced-motion search nav stays ready", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const errors = trackClientErrors(page);

  await openSearch(page, "/");

  await expect.poll(async () => {
    return page.locator("html").evaluate((node) => ({
      ready: node.classList.contains("is-page-ready"),
      transitioning: node.classList.contains("is-transitioning"),
    }));
  }).toEqual({ ready: true, transitioning: false });

  expect(errors).toEqual([]);
  await context.close();
});

test("pt-br home can warm-search on first nav", async ({ page }) => {
  const errors = trackClientErrors(page);

  await openSearch(page, "/pt-br/");
  await expect(page).toHaveURL(/\/pt-br\/search\/?$/);

  expect(errors).toEqual([]);
});

test("sine panels stay interactive across client navigation", async ({ page }) => {
  const errors = trackClientErrors(page);
  await disableBrowserCache(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator('a[href="/sine/"]').first().click();
  await expect(page).toHaveURL(/\/sine\/?$/);
  await expect(page.locator(".sine-panel").first()).toBeVisible();
  await waitForTransitionSequence(page);

  await page.locator(".sine-panel").first().click();
  await expect(page.locator("#sine-overlay")).toHaveClass(/is-open/);
  await expect(page.locator("#sine-modal-title")).not.toHaveText("");
  await expect.poll(async () => {
    return page.locator("#sine-modal-main").innerText();
  }).not.toContain("Loading...");
  await page.locator("#sine-modal-close").click();
  await expect(page.locator("#sine-overlay")).not.toHaveClass(/is-open/);

  await page.locator(".nav__logo").click();
  await expect(page).toHaveURL(/\/$/);
  await page.locator('a[href="/sine/"]').first().click();
  await expect(page).toHaveURL(/\/sine\/?$/);
  await expect(page.locator(".sine-panel").nth(1)).toBeVisible();
  await waitForTransitionSequence(page);

  await page.locator(".sine-panel").nth(1).click();
  await expect(page.locator("#sine-overlay")).toHaveClass(/is-open/);
  await expect(page.locator("#sine-modal-title")).not.toHaveText("");
  await expect.poll(async () => {
    return page.locator("#sine-modal-main").innerText();
  }).not.toContain("Loading...");

  expect(errors).toEqual([]);
});
