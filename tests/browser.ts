import { test as base, expect, type BrowserContext } from '@playwright/test';
import path from 'node:path';

// Chromium reads the built site without starting or contacting a development server.
export async function serveBuild(context: BrowserContext, baseURL: string) {
  const dist = path.resolve('dist');
  await context.route(`${baseURL}/**`, async route => {
    const pathname = new URL(route.request().url()).pathname;
    const file = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(dist + path.sep)) return route.abort();
    await route.fulfill({ path: file });
  });
}

export const test = base.extend({
  context: async ({ context, baseURL }, use) => {
    if (!baseURL) throw new Error('Set Playwright baseURL before serving the build.');
    await serveBuild(context, baseURL);
    await use(context);
  },
});
export { expect };

