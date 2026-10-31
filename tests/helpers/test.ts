import { test as base, type Browser } from "@playwright/test";
import { ownWindowsWebKitExit } from "./windows-webkit";

export { expect } from "@playwright/test";
export type { Page } from "@playwright/test";

export const test = base.extend({
  browser: [async ({ browser, browserName, playwright, launchOptions, headless, connectOptions }, use) => {
    if (process.platform !== "win32" || browserName !== "webkit" || connectOptions) {
      await use(browser);
      return;
    }

    // Preserve the built-in fixture for other engines and external connections.
    // The unused local browser has no contexts or auxiliary network processes.
    await browser.close();
    const executable = launchOptions.executablePath || playwright.webkit.executablePath();
    const started = new Date();
    const server = await playwright.webkit.launchServer({
      ...launchOptions, headless, host: "127.0.0.1", handleSIGINT: false,
    });
    const cleanup = ownWindowsWebKitExit(server.process(), executable, started);
    let connected: Browser | undefined;
    try {
      connected = await playwright.webkit.connect(server.wsEndpoint());
      await use(connected);
    } finally {
      try { await connected?.close(); }
      finally {
        await server.close();
        const error = await cleanup;
        if (error) throw error;
      }
    }
  }, { scope: "worker" }],
});
