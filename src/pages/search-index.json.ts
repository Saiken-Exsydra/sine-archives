import type { APIRoute } from "astro";
import { normalizeLocale } from "../i18n/config";
import { buildSearchIndex } from "../utils/search-index";

export const GET: APIRoute = async ({ url }) => {
  const locale = normalizeLocale(url.searchParams.get("locale") ?? undefined);
  const payload = await buildSearchIndex(locale);

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
