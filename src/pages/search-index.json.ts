import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SECTIONS } from "../sections";
import { CONTENT_KEYS } from "../content-keys";

const labelByKey = Object.fromEntries(SECTIONS.map((s) => [s.key, s.label])) as Record<string, string>;
const sections = CONTENT_KEYS.map((key) => ({ key, label: labelByKey[key] ?? key }));

export const GET: APIRoute = async () => {
  const itemsNested = await Promise.all(
    sections.map(async (s) => {
      const entries = await getCollection(s.key);

      return entries
        .filter((e) => e.data.status === "public")
        .map((e) => ({
          section: s.key,
          sectionLabel: s.label,
          slug: e.slug,
          href: `/${s.key}/${e.slug}/`,
          title: e.data.title,
          summary: e.data.summary,
          tags: e.data.tags ?? [],
          created: e.data.created,
          updated: e.data.updated,
          image: e.data.image ?? null,
          body: e.body ?? "",
        }));
    })
  );

  const items = itemsNested.flat();

  return new Response(JSON.stringify({ items }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
