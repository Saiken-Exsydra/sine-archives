import { expect, test, type Page } from "@playwright/test";

type CharacterRuntimeSnapshot = {
  cleanupActive: boolean;
  controllerRegistered: boolean;
  rootConnected: boolean;
  route: string | null;
  transitioning: boolean;
};

function isExpectedTransitionCancellation(message: string) {
  return message === "Skipped ViewTransition due to skipTransition() call"
    || message === "AbortError: Skipping view transition because skipTransition() was called.";
}

async function expectCharacterControllerReady(page: Page) {
  await expect.poll(async (): Promise<CharacterRuntimeSnapshot> => {
    return page.evaluate(() => {
      const state = (window as any).__sineTransitionState;
      const initializer = [...(state?.initializers?.values?.() ?? [])]
        .find((record: { key?: string; route?: string }) => record.key === "characters-page" && record.route === "characters");
      return {
        cleanupActive: [...(state?.cleanups?.keys?.() ?? [])]
          .some((key: string) => key === "route:characters:characters-page"),
        controllerRegistered: Boolean(initializer),
        rootConnected: document.querySelector("#chars-root[data-character-controller=\"ready\"]")?.isConnected === true,
        route: document.documentElement.dataset.transitionRoute ?? null,
        transitioning: document.documentElement.classList.contains("is-transitioning"),
      };
    });
  }).toEqual({
    cleanupActive: true,
    controllerRegistered: true,
    rootConnected: true,
    route: "character-index",
    transitioning: false,
  });
}

async function expectOneCharacterController(page: Page) {
  await expect.poll(async () => page.evaluate(() => {
    const state = (window as any).__sineTransitionState;
    return {
      active: [...(state?.cleanups?.keys?.() ?? [])]
        .filter((key: string) => key.endsWith(":characters-page")).length,
      registeredForRoute: [...(state?.initializers?.values?.() ?? [])]
        .filter((record: { key?: string; route?: string }) => record.key === "characters-page" && record.route === "characters").length,
    };
  })).toEqual({ active: 1, registeredForRoute: 1 });
}

async function openCharacterIndex(page: Page) {
  await expect.poll(() => page.locator("html").evaluate((root) => ({
    ready: root.classList.contains("is-page-ready"),
    transitioning: root.classList.contains("is-transitioning"),
  }))).toEqual({ ready: true, transitioning: false });
  await page.locator('a[href="/characters/"]').first().evaluate((link: HTMLAnchorElement) => link.click());
  await expect(page).toHaveURL(/\/characters\/?(?:\?.*)?$/);
  await expect(page.locator("#chars-root")).toBeVisible();
  await expectCharacterControllerReady(page);
}

async function selectCharacter(page: Page, index: number) {
  const item = page.locator(".sidebar__item").nth(index);
  const expectedName = (await item.locator(".sidebar__item-name").textContent())?.trim();
  expect(expectedName).toBeTruthy();

  await item.click();
  await expect(page.locator("#stage-name")).toHaveText(expectedName!);
  await expect(item).toHaveClass(/\bis-active\b/);
  await expect(page).toHaveURL(new RegExp(`[?&]char=${encodeURIComponent((await item.getAttribute("data-character-slug")) ?? "")}`));
  await expectCharacterControllerReady(page);
}

test("character selection survives repeated routes, dossier returns, and history traversal", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    if (!isExpectedTransitionCancellation(error.message)) errors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error" && !isExpectedTransitionCancellation(message.text())) {
      errors.push(message.text());
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await openCharacterIndex(page);

  for (const index of [1, 2, 3, 4, 5]) {
    await selectCharacter(page, index);
  }

  const sidebar = page.locator("#sidebar-list");
  await sidebar.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await expect.poll(() => sidebar.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);

  const rapidTarget = page.locator(".sidebar__item").nth(10);
  const rapidTargetName = (await rapidTarget.locator(".sidebar__item-name").textContent())?.trim();
  await page.evaluate(() => {
    for (const index of [8, 9, 10]) {
      (document.querySelector(`#sidebar-item-${index}`) as HTMLButtonElement)?.click();
    }
  });
  await expect(page.locator("#stage-name")).toHaveText(rapidTargetName!);

  const keyboardTarget = page.locator(".sidebar__item").nth(11);
  const keyboardTargetName = (await keyboardTarget.locator(".sidebar__item-name").textContent())?.trim();
  await keyboardTarget.focus();
  await keyboardTarget.press("Enter");
  await expect(page.locator("#stage-name")).toHaveText(keyboardTargetName!);

  await page.locator("#stage-cta").click();
  await expect(page).toHaveURL(/\/characters\/[^/]+\/?(?:\?.*)?$/);
  await page.getByRole("link", { name: "Characters", exact: true }).click();
  await expectCharacterControllerReady(page);
  await selectCharacter(page, 6);

  for (let cycle = 0; cycle < 6; cycle += 1) {
    await page.locator(".nav__logo").click();
    await expect(page).toHaveURL(/\/$/);
    await openCharacterIndex(page);
    await selectCharacter(page, (cycle + 7) % 12);
  }

  await page.locator(".nav__logo").click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expectCharacterControllerReady(page);
  await selectCharacter(page, 2);
  await page.goForward();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expectCharacterControllerReady(page);
  await selectCharacter(page, 3);
  await expectOneCharacterController(page);

  expect(errors).toEqual([]);
});

test("character selection recovers when URL synchronization throws", async ({ page }) => {
  await page.goto("/characters/", { waitUntil: "networkidle" });
  await expectCharacterControllerReady(page);

  await page.evaluate(() => {
    const original = history.replaceState.bind(history);
    let shouldFail = true;
    history.replaceState = ((...args: Parameters<History["replaceState"]>) => {
      if (shouldFail) {
        shouldFail = false;
        throw new DOMException("Simulated history failure", "SecurityError");
      }
      return original(...args);
    }) as History["replaceState"];
  });

  const item = page.locator(".sidebar__item").nth(1);
  const expectedName = (await item.locator(".sidebar__item-name").textContent())?.trim();
  await item.click();

  await expect(page.locator("#stage-name")).toHaveText(expectedName!);
  await expect(item).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#stage-name")).toHaveClass(/\bis-in\b/);
  await expectCharacterControllerReady(page);
});
