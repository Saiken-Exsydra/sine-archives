import { expect, test } from "@playwright/test";

const routes = [
  "/", "/apparatus/", "/apparatus/clepsydra-apparatus/", "/characters/",
  "/characters/ella-wonderwall/", "/characters/ella-wonderwall/codex/",
  "/search/", "/sine/", "/places/", "/places/map/", "/organizations/",
  "/organizations/obsidian-rite/", "/cosmology/", "/systems/", "/systems/observatory/",
  "/systems/resonance-field/", "/systems/harmonics/", "/systems/redactory/",
  "/systems/redactory/dive/", "/systems/redactory/redactor/",
  "/systems/redactory/index-theorem/", "/soundtracks/", "/pt-br/", "/pt-br/characters/",
];

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`page families fit a ${width}px viewport`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1080 });
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect([200, 304], route).toContain(response?.status());
      await expect(page.locator("html"), route).toHaveClass(/is-page-ready/);
      await expect(page.locator("main").first(), route).toBeVisible();
      await expect.poll(() => page.evaluate(() =>
        document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
      ), { message: `Document overflow at ${route} (${width}px)` }).toBe(true);
      if (width === 390 || width === 1440) {
        await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll("/", "_") || "home"}-${width}.png`) });
      }
    }
    expect(errors).toEqual([]);
  });
}
