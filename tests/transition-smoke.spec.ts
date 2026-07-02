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

test("character dossier opens and returns smoothly", async ({ page }) => {
  const errors = trackClientErrors(page);
  await disableBrowserCache(page);

  await page.goto("/characters/", { waitUntil: "networkidle" });
  await expect(page.locator("#stage-cta")).toBeVisible();

  await page.locator("#stage-cta").click();
  await expect(page).toHaveURL(/\/characters\/[^/]+\/?(\?.*)?$/);
  await expect(page.locator(".char-page")).toBeVisible();
  await expect(page.locator("[data-character-main]")).toBeVisible();
  await waitForTransitionSequence(page);

  await page.getByRole("link", { name: "Characters", exact: true }).click();
  await expect(page).toHaveURL(/\/characters\/?\?char=[^&]+$/);
  await expect(page.locator("#stage-cta")).toBeVisible();
  await waitForTransitionSequence(page);

  expect(errors).toEqual([]);
});

test("systems panels stay interactive after returning from Redactory desk", async ({ page }) => {
  const errors = trackClientErrors(page);

  await page.goto("/systems/", { waitUntil: "networkidle" });
  const redactoryPanel = page.locator('.sys-panel[data-key="redactory"]');
  await redactoryPanel.click();
  await expect(page.locator("#sys-split")).toHaveAttribute("data-active", "redactory");

  await page.getByRole("link", { name: /Enter the Redactory Desk/i }).click();
  await expect(page).toHaveURL(/\/systems\/redactory\/?$/);

  await page.getByRole("link", { name: "Systems", exact: true }).click();
  await expect(page).toHaveURL(/\/systems\/?$/);
  await expect(page.locator("#sys-split")).toHaveAttribute("data-active", "");

  await page.locator('.sys-panel[data-key="divination"]').click();
  await expect(page.locator("#sys-split")).toHaveAttribute("data-active", "divination");

  await page.getByRole("button", { name: /All Systems/i }).click();
  await expect(page.locator("#sys-split")).toHaveAttribute("data-active", "");

  await page.getByRole("button", { name: /Addendums/i }).click();
  await expect(page.locator("#sys-overlay")).toHaveClass(/is-open/);
  await page.getByRole("button", { name: /Close/i }).click();
  await expect(page.locator("#sys-overlay")).not.toHaveClass(/is-open/);

  expect(errors).toEqual([]);
});

test("observatory launches system interfaces", async ({ page }) => {
  const errors = trackClientErrors(page);
  await disableBrowserCache(page);

  await page.goto("/systems/observatory/", { waitUntil: "networkidle" });
  await expect(page.locator("[data-system-node='redactory']")).toBeVisible();

  await page.locator("[data-system-node='redactory']").click();
  await expect(page).toHaveURL(/\/systems\/redactory\/?$/);
  await expect(page.locator(".redactory-desk")).toBeVisible();
  await waitForTransitionSequence(page);

  await page.getByRole("link", { name: /Systems Observatory/i }).first().click();
  await expect(page).toHaveURL(/\/systems\/observatory\/?$/);
  await expect(page.locator("[data-system-node='harmonics']")).toBeVisible();

  await page.locator("[data-system-node='harmonics']").click();
  await expect(page).toHaveURL(/\/systems\/harmonics\/?$/);
  await expect(page.locator("[data-system-interface='harmonics']")).toBeVisible();

  await page.goto("/systems/observatory/", { waitUntil: "networkidle" });
  await page.locator("[data-system-node='resonance']").click();
  await expect(page).toHaveURL(/\/systems\/resonance-field\/?$/);
  await expect(page.locator("[data-system-interface='resonance']")).toBeVisible();

  expect(errors).toEqual([]);
});

test("apparatus filters survive return navigation", async ({ page }) => {
  const errors = trackClientErrors(page);

  await page.goto("/apparatus/", { waitUntil: "networkidle" });
  await page.locator(".reg-entry").first().click();
  await expect(page).toHaveURL(/\/apparatus\/[^/]+\/?$/);
  await page.getByRole("link", { name: "Apparatus", exact: true }).click();
  await expect(page).toHaveURL(/\/apparatus\/?$/);

  const apparatusSearch = page.locator("#reg-search");
  await apparatusSearch.fill("zzzz-no-match");
  await expect(page.locator("#reg-empty")).toHaveClass(/is-visible/);

  expect(errors).toEqual([]);
});

test("section index controls survive leaving and returning", async ({ page }) => {
  const errors = trackClientErrors(page);

  await page.goto("/cosmology/", { waitUntil: "networkidle" });
  await page.locator(".nav__logo").click();
  await page.locator('a[href="/cosmology/"]').first().click();
  await page.locator("[data-open-entry]").first().click();
  await expect(page.locator("#cosmo-overlay")).toHaveClass(/is-open/);
  await page.locator("#cosmo-modal-close").click();

  await page.goto("/organizations/", { waitUntil: "networkidle" });
  await page.locator(".nav__logo").click();
  await page.locator('a[href="/organizations/"]').first().click();
  await page.locator('a.org-spread__cta[href="/organizations/apocachynthion/"]').click();
  await expect(page).toHaveURL(/\/organizations\/apocachynthion\/?$/);
  await expect(page.locator(".org-dossier")).toBeVisible();
  await expect(page.locator(".org-dossier__header h1")).toHaveText("The Apocachynthion");
  await expect(page.locator("#org-overlay")).toHaveCount(0);
  await page.locator(".org-dossier__back").click();
  await expect(page).toHaveURL(/\/organizations\/?$/);

  await page.goto("/places/", { waitUntil: "networkidle" });
  await page.locator(".nav__logo").click();
  await page.locator('a[href="/places/"]').first().click();
  await page.locator("#places-search-btn").click();
  await expect(page.locator("#places-search-panel")).toHaveClass(/is-open/);

  await page.goto("/places/map/", { waitUntil: "networkidle" });
  await page.locator(".nav__logo").click();
  await page.locator('a[href="/places/"]').first().click();
  await page.locator('a[href="/places/map/"]').click();
  await page.locator(".handle").first().click();
  await expect(page.locator("#dossier")).toHaveClass(/is-open/);

  expect(errors).toEqual([]);
});
