import { defineConfig, devices, firefox } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const localFirefox = join(fileURLToPath(new URL('../', import.meta.url)), '.impeccable',
  'playwright-browsers', basename(dirname(dirname(firefox.executablePath()))), 'firefox', 'firefox.exe');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  outputDir: '../test-results/react',
  use: { baseURL: 'http://127.0.0.1:4174', trace: 'retain-on-failure' },
  webServer: {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    command: 'node scripts/react-site.mjs preview',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], launchOptions: process.platform === 'win32' && existsSync(localFirefox) ? { executablePath: localFirefox } : {} } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
