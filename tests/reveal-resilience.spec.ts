import { expect, test } from "./helpers/test";

const families = [
  { route: "/", selector: ".list-row__label" },
  { route: "/organizations/", selector: ".org-spread__title, .org-spread__summary, .org-spread__cta" },
  { route: "/cosmology/", selector: ".cosmo-panel__title, .cosmo-panel__summary, .cosmo-panel__cta" },
  { route: "/search/", selector: ".search-primary-card__title, .search-card__title, .search-row:not([hidden]) .search-row__title" },
];

for (const locale of ["", "/pt-br"]) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale || "en"} reading copy survives reveal enhancement ${javaScriptEnabled ? "on" : "off"}`, async ({ browser }) => {
      test.setTimeout(90_000);
      const context = await browser.newContext({ javaScriptEnabled });
      const page = await context.newPage();
      try {
        for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          for (const reducedMotion of ["no-preference", "reduce"] as const) {
            await page.emulateMedia({ reducedMotion });
            for (const { route, selector } of families) {
              await page.goto(`${locale}${route}`, { waitUntil: "domcontentloaded" });
              if (javaScriptEnabled) await expect(page.locator("html")).toHaveClass(/is-page-ready/);
              // Without page setup, native load is the readiness boundary.
              // Focusing during loading can race layout and scroll restoration.
              else await page.waitForLoadState("load");
              const copy = page.locator(selector);
              expect(await copy.count(), `${route} has reading copy`).toBeGreaterThan(0);
              // Playwright visibility permits opacity: 0. Inspect ancestors too:
              // a fully opaque heading inside a transparent row is still unreadable.
              await expect.poll(() => copy.evaluateAll(nodes => nodes.filter(node => {
                let opacity = 1;
                for (let owner: Element | null = node; owner; owner = owner.parentElement) {
                  opacity *= Number(getComputedStyle(owner).opacity);
                }
                return opacity < 0.95 || !node.textContent?.trim();
              }).map(node => node.textContent?.trim())), {
                message: `Unpainted copy at ${locale}${route}, ${width}px, ${reducedMotion}`,
              }).toEqual([]);
              // Exercise keyboard access beyond the hero. WebKit does not
              // scroll a deferred descendant through scrollIntoViewIfNeeded;
              // focusing its native record link reveals it correctly.
              const lastLink = copy.last().locator("xpath=ancestor-or-self::a[1]");
              await lastLink.focus();
              await expect(lastLink).toBeFocused();
              await expect(copy.last()).toBeInViewport();
              await expect(copy.last()).toBeVisible();
            }
          }
        }
      } finally {
        await context.close();
      }
    });
  }
}
