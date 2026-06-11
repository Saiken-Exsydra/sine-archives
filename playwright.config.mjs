import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  workers: 1,
  use: {
    baseURL,
    serviceWorkers: "block",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
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
  ],
});
