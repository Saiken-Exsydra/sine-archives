// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    resolve: {
      alias: {
        "aria-query": fileURLToPath(new URL("./src/shims/aria-query.ts", import.meta.url)),
        "axobject-query": fileURLToPath(new URL("./src/shims/axobject-query.ts", import.meta.url)),
      },
    },
  },
});
