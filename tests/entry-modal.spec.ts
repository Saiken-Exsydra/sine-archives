import { expect, test } from "@playwright/test";

for (const locale of ["", "/pt-br"]) {
  for (const [section, prefix, trigger] of [
    ["sine", "sine", ".sine-panel"],
    ["cosmology", "cosmo", "[data-open-entry]"],
  ]) {
    test(`${locale || "en"} ${section} modal contains focus and restores it`, async ({ page }) => {
      await page.goto(`${locale}/${section}/`);
      await expect(page.locator("html")).toHaveClass(/is-page-ready/);
      const opener = page.locator(trigger).first();
      await opener.focus();
      await page.keyboard.press("Enter");
      const modal = page.getByRole("dialog");
      await expect(modal).toHaveAccessibleName(/.+/);
      await expect(page.locator(`#${prefix}-modal-close`)).toBeFocused();
      await expect.poll(() => page.locator(".nav").evaluate((node) => !!node.closest("[inert]"))).toBe(true);
      for (const key of ["Shift+Tab", "Tab", "Tab", "Shift+Tab"]) {
        await page.keyboard.press(key);
        await expect.poll(() => modal.evaluate((node) => node.contains(document.activeElement))).toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(page.locator(`#${prefix}-overlay`)).toHaveAttribute("inert", "");
      await expect(opener).toBeFocused();
      await expect.poll(() => page.locator(".nav").evaluate((node) => !!node.closest("[inert]"))).toBe(false);
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    });
  }
}

test("a slow closed entry cannot replace the next entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/sine/");
  await expect(page.locator("html")).toHaveClass(/is-page-ready/);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/sine/sine/", async (route) => {
    await gate;
    await route.fulfill({ contentType: "text/html", body: '<article data-entry-body>STALE ENTRY</article>' }).catch(() => {});
  });
  const request = page.waitForRequest("**/sine/sine/");
  await page.locator('.sine-panel[data-slug="sine"]').click();
  await request;
  await page.keyboard.press("Escape");
  await expect(page.locator("#sine-overlay")).toHaveAttribute("inert", "");
  await page.locator('.sine-panel[data-slug="hourglass"]').click();
  release();
  await expect(page.locator("#sine-modal-main")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#sine-modal-main")).not.toContainText("STALE ENTRY");
  await expect(page.locator("#sine-modal-main")).not.toHaveText("");
  await expect(page.locator("#sine-modal-title")).toContainText(/HourGlass/i);
});

test("navigation from an open modal releases the background and controller", async ({ page }) => {
  await page.goto("/cosmology/");
  await expect(page.locator("html")).toHaveClass(/is-page-ready/);
  await page.locator("[data-open-entry]").first().click();
  await expect(page.locator("#cosmo-modal-body")).not.toHaveAttribute("aria-busy", "true");
  // Exercise a client route swap while the overlay owns the scroll/focus lock.
  await page.locator(".nav__logo").evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveClass(/is-page-ready/);
  await expect(page.locator(".nav")).not.toHaveAttribute("inert", "");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.goBack();
  await expect(page.locator("html")).toHaveClass(/is-page-ready/);
  await page.locator("[data-open-entry]").first().click();
  await expect(page.locator("#cosmo-modal-close")).toBeFocused();
});
