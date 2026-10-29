import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers/navigation";

for (const width of [320, 390, 1440]) {
  test(`React lab is interactive at ${width}px`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoReady(page, "/_lab/onlook/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow, noarchive");
    await expect(page.getByRole("heading", { name: "Archive record", exact: true })).toBeVisible();
    // Await real hydration, not just the server-rendered button markup.
    await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
    const notes = page.getByRole("button", { name: "Review notes", exact: true });
    await notes.focus();
    await page.keyboard.press("Enter");
    await expect(notes).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Inspect the reading states" })).toBeVisible();
    await page.getByRole("checkbox", { name: "Compact spacing" }).check();
    await expect(page.locator(".onlook-record")).toHaveAttribute("data-compact", "true");
    const disclosure = page.getByRole("button", { name: "Show evaluation checklist" });
    await disclosure.focus();
    await page.keyboard.press("Space");
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#lab-checklist")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`lab-${width}.png`), fullPage: true });
    await page.getByRole("button", { name: "Overview", exact: true }).click();
    await expect(page.getByRole("heading", { name: "A quiet place to read" })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("lab rehydrates on history return and supports the existing locale switch", async ({ page }) => {
  await gotoReady(page, "/_lab/onlook/");
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await page.getByRole("button", { name: "Review notes", exact: true }).click();
  await page.locator(".onlook-record__footer a").click();
  await expect(page).toHaveURL("/");
  await page.goBack();
  await expect(page).toHaveURL("/_lab/onlook/");
  const notes = page.getByRole("button", { name: "Review notes", exact: true });
  await expect(notes).toBeVisible();
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await notes.click();
  await expect(page.getByRole("heading", { name: "Inspect the reading states" })).toBeVisible();
  await page.locator('.nav__locale-pill[hreflang="pt-BR"]').click();
  await expect(page).toHaveURL("/pt-br/_lab/onlook/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await page.getByRole("button", { name: "Notas de revisão", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Inspecione os estados de leitura" })).toBeVisible();
});
