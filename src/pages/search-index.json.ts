import type { APIRoute } from "astro";
import { SECTIONS } from "../sections";
import { CONTENT_KEYS } from "../content-keys";
import { getLocalizedCollection } from "../i18n/content";
import { localizedEntryPath, localizedPath, normalizeLocale } from "../i18n/config";
import { getImageUrl } from "../utils/optimized-images";
import { getLocalizedMusicCatalog } from "../data/music";

const labelByKey = Object.fromEntries(SECTIONS.map((s) => [s.key, s.label])) as Record<string, string>;
const sections = CONTENT_KEYS.map((key) => ({ key, label: labelByKey[key] ?? key }));

export const GET: APIRoute = async ({ url }) => {
  const locale = normalizeLocale(url.searchParams.get("locale") ?? undefined);
  const itemsNested = await Promise.all(
    sections.map(async (s) => {
      const entries = await getLocalizedCollection(s.key, locale);

      return Promise.all(
        entries
          .filter((e) => e.data.status === "public")
          .map(async (e) => {
            return {
              section: s.key,
              sectionLabel: s.label,
              slug: e.slug,
              href: localizedEntryPath(locale, s.key, e.slug),
              title: e.data.title,
              summary: e.data.summary,
              tags: e.data.tags ?? [],
              created: e.data.created,
              updated: e.data.updated,
              image: getImageUrl(e.data.image ?? null),
              body: e.body ?? "",
            };
          })
      );
    })
  );

  const soundtrackItems = getLocalizedMusicCatalog(locale).map((track) => ({
    section: "soundtracks",
    sectionLabel: "Soundtracks",
    slug: track.id,
    href: localizedPath(locale, `/soundtracks/?track=${encodeURIComponent(track.id)}`),
    title: track.title,
    summary: track.summary,
    tags: [track.kindLabel, track.album, track.mood].filter(Boolean),
    created: track.year,
    updated: track.year,
    image: track.image,
    body: [track.subtitle, track.summary, track.album, track.mood].filter(Boolean).join(" "),
  }));

  const items = [...itemsNested.flat(), ...soundtrackItems];

  return new Response(JSON.stringify({ items }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
