import { defineConfig, devices, firefox } from "@playwright/test";
import { existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PLAYWRIGHT_PORT || 4321);
const baseURL = `http://127.0.0.1:${PORT}`;
// Some Windows hosts cannot resolve Firefox's private DLL assembly in AppData.
// An unchanged project-local copy works; match the locked Playwright revision.
const localFirefox = join(
  fileURLToPath(new URL(".", import.meta.url)), ".impeccable", "playwright-browsers",
  basename(dirname(dirname(firefox.executablePath()))), "firefox", "firefox.exe",
);
const firefoxLaunchOptions = process.platform === "win32"
  && !process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(localFirefox)
  ? { executablePath: localFirefox }
  : {};

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  // The serial three-engine matrix needs three 15-minute engine budgets.
  // Individual assertions and worker shutdown keep their normal timeouts.
  globalTimeout: 45 * 60_000,
  expect: {
    timeout: 10_000,
  },
  workers: 1,
  use: {
    baseURL,
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        browserName: "firefox",
        launchOptions: firefoxLaunchOptions,
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        browserName: "webkit",
      },
    },
  ],
});
