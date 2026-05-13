import { getCollection, type CollectionEntry } from "astro:content";
import type { ContentKey } from "../content-keys";
import { DEFAULT_LOCALE, type SiteLocale } from "./config";

type LocalizedCollectionName = `${ContentKey}_${"en" | "pt_br"}`;
type LocalizedEntry = CollectionEntry<LocalizedCollectionName>;

export function getLocalizedCollectionName(section: ContentKey, locale: SiteLocale): LocalizedCollectionName {
  return `${section}_${locale === "pt-br" ? "pt_br" : "en"}`;
}

export async function getLocalizedCollection(
  section: ContentKey,
  locale: SiteLocale
): Promise<LocalizedEntry[]> {
  const primary = await getCollection(getLocalizedCollectionName(section, locale));
  if (locale === DEFAULT_LOCALE) return primary;

  const fallback = await getCollection(getLocalizedCollectionName(section, DEFAULT_LOCALE));
  const merged = new Map<string, LocalizedEntry>();

  for (const entry of fallback) merged.set(entry.slug, entry);
  for (const entry of primary) merged.set(entry.slug, entry);

  return [...merged.values()];
}

export async function getLocalizedPublicCollection(section: ContentKey, locale: SiteLocale) {
  const entries = await getLocalizedCollection(section, locale);
  return entries.filter((entry) => entry.data.status === "public");
}
