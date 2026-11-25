import { test as base, expect } from '@playwright/test';
import path from 'node:path';

// Serve the real Vite output in Chromium when the host disallows loopback sockets.
export const test = base.extend({
  page: async ({ page }, use) => {
    if (process.env.SINE_TEST_DIST) {
      await page.route('http://127.0.0.1:4175/**', async route => {
        const pathname = new URL(route.request().url()).pathname;
        const dist = path.resolve('dist');
        const file = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
        if (!file.startsWith(dist + path.sep)) return route.abort();
        await route.fulfill({ path: file });
      });
    }
    await use(page);
  },
});
export { expect };

