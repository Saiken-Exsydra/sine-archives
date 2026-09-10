import { expect, type Page } from "@playwright/test";

/** Audio and speculative requests may continue after the interface is ready. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/is-page-ready/);
}
