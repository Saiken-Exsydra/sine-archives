// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import remarkArchiveHeadingIds from "./src/utils/remark-archive-heading-ids.mjs";
import remarkArchiveWikiLinks from "./src/utils/remark-archive-wiki-links.mjs";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  markdown: {
    remarkPlugins: [remarkArchiveHeadingIds, remarkArchiveWikiLinks],
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
