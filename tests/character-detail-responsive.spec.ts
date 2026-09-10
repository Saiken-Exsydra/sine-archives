import { gotoReady } from "./helpers/navigation";
import { expect, test } from "@playwright/test";

const states = [
  { width: 390, height: 844, mode: "compact" },
  { width: 768, height: 1024, mode: "compact" },
  { width: 1180, height: 900, mode: "constrained" },
  { width: 1366, height: 768, mode: "standard" },
  { width: 1920, height: 1080, mode: "wide" },
  { width: 2560, height: 1440, mode: "wide" },
  { width: 3440, height: 1440, mode: "wide" },
  { width: 5120, height: 1440, mode: "wide" },
] as const;

test("character dossier composes continuously from compact to ultrawide", async ({ page }) => {
  test.setTimeout(120_000);

  for (const state of states) {
    await page.setViewportSize({ width: state.width, height: state.height });
    await gotoReady(page, "/characters/ella-wonderwall/");

    const metrics = await page.evaluate(() => {
      const rect = (selector: string) => {
        const node = document.querySelector(selector);
        if (!(node instanceof HTMLElement)) return null;
        const box = node.getBoundingClientRect();
        return { x: box.x, top: box.top, right: box.right, bottom: box.bottom, width: box.width };
      };

      return {
        viewportWidth: window.innerWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        rail: rect(".char-rail"),
        context: rect(".char-tools"),
        document: rect(".char-main"),
        summary: rect(".char-main__summary"),
        record: rect(".char-section-block"),
        proseWidth: rect(".dossier-prose p")?.width ?? 0,
        contextPosition: getComputedStyle(document.querySelector(".char-tools")!).position,
      };
    });

    expect(metrics.pageScrollWidth, `${state.width}px page overflow`).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    expect(metrics.rail).not.toBeNull();
    expect(metrics.context).not.toBeNull();
    expect(metrics.document).not.toBeNull();
    expect(metrics.summary).not.toBeNull();
    expect(metrics.record).not.toBeNull();
    // The prose remains 76ch; its pixel width grows slightly with the bounded
    // large-workspace type scale.
    expect(metrics.proseWidth).toBeLessThanOrEqual(860);

    if (state.mode === "compact") {
      expect(metrics.document!.top).toBeGreaterThanOrEqual(metrics.rail!.bottom - 2);
      expect(metrics.context!.top).toBeGreaterThanOrEqual(metrics.summary!.bottom - 2);
      expect(metrics.record!.top).toBeGreaterThanOrEqual(metrics.context!.bottom - 2);
      expect(metrics.contextPosition).toBe("static");
    } else if (state.mode === "constrained") {
      expect(metrics.rail!.x).toBeLessThan(metrics.document!.x);
      expect(metrics.context!.x).toBeGreaterThanOrEqual(metrics.document!.x);
      expect(metrics.context!.right).toBeLessThanOrEqual(metrics.document!.right + 1);
      expect(metrics.context!.top).toBeGreaterThanOrEqual(metrics.summary!.bottom - 2);
      expect(metrics.record!.top).toBeGreaterThanOrEqual(metrics.context!.bottom - 2);
    } else if (state.mode === "standard") {
      expect(metrics.rail!.x).toBeLessThan(metrics.document!.x);
      expect(metrics.context!.x).toBeGreaterThanOrEqual(metrics.document!.x);
      expect(metrics.context!.right).toBeLessThanOrEqual(metrics.document!.right + 1);
      expect(metrics.record!.top).toBeGreaterThanOrEqual(metrics.context!.bottom - 2);
    } else {
      expect(metrics.rail!.x).toBeLessThan(metrics.document!.x);
      expect(metrics.document!.x).toBeLessThan(metrics.context!.x);
      expect(metrics.rail!.width).toBeLessThanOrEqual(521);
      expect(metrics.contextPosition).toBe("fixed");
    }
  }
});

test("metadata modules replace File Data without entering the prose hierarchy", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page, "/characters/ella-wonderwall/");

  const metadata = page.locator("[data-character-metadata]");
  await expect(metadata).toHaveCount(1);
  await expect(metadata.locator(".dossier-module--classification")).toContainText("Abyssal Anchor");
  await expect(metadata.locator(".dossier-module--classification")).toContainText("Light");
  await expect(metadata.locator(".dossier-module--classification")).toContainText("Experienced Quill");
  await expect(metadata.locator(".dossier-module--classification img")).toHaveAttribute(
    "src",
    "/uploads/Abyssal_Anchor_symbol.png",
  );

  await expect(metadata.locator(".dossier-module--registry")).toContainText("Registered experienced Quill");
  await expect(metadata.locator(".dossier-module--registry")).toContainText("House Wonderwall; SiNE");
  await expect(metadata.locator(".dossier-module--registry")).toContainText("SiNE technical apprentice and Redactor");
  await expect(metadata.locator(".dossier-module--personal")).toContainText("c. Imperial Year 2189");
  await expect(metadata.locator(".dossier-module--personal")).toContainText("170 cm");
  await expect(metadata.locator(".dossier-module--personal")).toContainText("Not publicly recorded");

  await expect(page.getByText("File Data", { exact: true })).toHaveCount(0);
  await expect(page.locator("[data-character-toc] a", { hasText: "File Data" })).toHaveCount(0);

  const orderIsLogical = await page.evaluate(() => {
    const summary = document.querySelector(".char-main__summary");
    const tools = document.querySelector(".char-tools");
    const record = document.querySelector(".char-section-block");
    if (!summary || !tools || !record) return false;
    return !!(summary.compareDocumentPosition(tools) & Node.DOCUMENT_POSITION_FOLLOWING)
      && !!(tools.compareDocumentPosition(record) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(orderIsLogical).toBe(true);

  const metadataFits = await metadata.locator(".dossier-module__field").evaluateAll((fields) =>
    fields.every((field) => field.scrollWidth <= field.clientWidth + 1),
  );
  expect(metadataFits).toBe(true);
});

test("characters without structured classification omit only that module", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await gotoReady(page, "/characters/hisui-kirasagi/");

  await expect(page.locator(".dossier-module--classification")).toHaveCount(0);
  await expect(page.locator(".dossier-module--registry")).toHaveCount(1);
  await expect(page.locator(".dossier-module--personal")).toHaveCount(1);
  await expect(page.getByText("File Data", { exact: true })).toHaveCount(0);
});

test("portrait gallery behavior remains intact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page, "/characters/ella-wonderwall/");

  const slides = page.locator("[data-portrait-slide]");
  await expect(slides).toHaveCount(2);
  await expect(slides.nth(0)).toHaveAttribute("data-state", "active");
  await page.locator("[data-portrait-next]").click();
  await expect(slides.nth(1)).toHaveAttribute("data-state", "active");
});

test("one TOC follows the active scroll root in document and pane modes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page, "/characters/ella-wonderwall/");

  const details = page.locator(".char-toc");
  await expect(details).not.toHaveAttribute("open", "");
  await details.locator("summary").click();
  await details.locator("[data-toc-item]").nth(1).getByRole("link").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(details.locator("[data-toc-item]").nth(1)).toHaveClass(/is-active/);

  await page.setViewportSize({ width: 1920, height: 1080 });
  await gotoReady(page, "/characters/ella-wonderwall/");
  await expect(details).toHaveAttribute("open", "");
  await details.locator("[data-toc-item]").nth(1).getByRole("link").click();
  await expect.poll(() => page.locator("[data-character-main]").evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await expect(details.locator("[data-toc-item]").nth(1)).toHaveClass(/is-active/);
});
