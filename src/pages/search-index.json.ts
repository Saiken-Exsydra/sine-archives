import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const sections = [
  { key: "characters", label: "Characters" },
  { key: "places", label: "Places" },
  { key: "redactory", label: "Redactory" },
  { key: "organizations", label: "Organizations" },
  { key: "artifacts", label: "Artifacts" },
  { key: "sigillums", label: "Sigillums" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

export const GET: APIRoute = async () => {
  const itemsNested = await Promise.all(
    sections.map(async (s) => {
      const entries = await getCollection(s.key as SectionKey);

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
          // include body for search (raw markdown text)
          body: (e as any).body ?? "",
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
