import { CONTENT_KEYS, type ContentKey } from "../content-keys";
import { getLocalizedCollection } from "../i18n/content";
import { localizedEntryPath, type SiteLocale } from "../i18n/config";
import { SECTIONS } from "../sections";
import {
  buildOptimizedImageBundle,
  type OptimizedImageBundle,
  type ContentImageValue,
} from "./optimized-images";

const RESULT_IMAGE_SIZES = "(max-width: 600px) 100vw, (max-width: 960px) 50vw, (max-width: 1320px) 33vw, 25vw";

const SECTION_LABELS: Record<SiteLocale, Record<ContentKey, string>> = {
  en: {
    characters: "Characters",
    organizations: "Organizations",
    sine: "SiNE",
    places: "Places",
    apparatus: "Apparatus",
    systems: "Systems",
    cosmology: "Cosmology",
  },
  "pt-br": {
    characters: "Personagens",
    organizations: "Organizacoes",
    sine: "SiNE",
    places: "Lugares",
    apparatus: "Aparatos",
    systems: "Sistemas",
    cosmology: "Cosmologia",
  },
};

const SECTION_RANK = Object.fromEntries(CONTENT_KEYS.map((key, index) => [key, index])) as Record<ContentKey, number>;

type SearchIndexEntryData = {
  title: string;
  summary?: string;
  tags?: string[];
  created?: string;
  updated?: string;
  status?: string;
  image?: ContentImageValue;
  designation?: string;
  image_position?: string;
  type?: string;
  priority?: number;
};

export type SearchIndexItem = {
  id: string;
  section: ContentKey;
  sectionLabel: string;
  sectionRank: number;
  slug: string;
  href: string;
  title: string;
  summary: string;
  designation: string;
  type: string;
  tags: string[];
  created: string;
  updated: string;
  updatedTimestamp: number;
  image: OptimizedImageBundle | null;
  imagePosition: string;
  priority: number;
  defaultOrder: number;
  searchText: string;
};

export type SearchTagCount = {
  key: string;
  label: string;
  count: number;
};

export type SearchIndexPayload = {
  items: SearchIndexItem[];
  tags: SearchTagCount[];
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, " $1 ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, " $1 ")
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/^\s*>+/gm, " ")
    .replace(/[*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTimestamp(value: string | undefined): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) return parsed;
  const yearMatch = value.match(/(\d{4})/);
  return yearMatch ? Number.parseInt(yearMatch[1], 10) : 0;
}

function getSectionLabel(section: ContentKey, locale: SiteLocale): string {
  return SECTION_LABELS[locale][section] ?? SECTION_LABELS.en[section] ?? section;
}

export async function buildSearchIndex(locale: SiteLocale): Promise<SearchIndexPayload> {
  const itemsNested = await Promise.all(
    CONTENT_KEYS.map(async (section): Promise<SearchIndexItem[]> => {
      const entries = await getLocalizedCollection(section, locale);

      return Promise.all(
        entries
          .filter((entry) => (entry.data as SearchIndexEntryData).status === "public")
          .map(async (entry): Promise<SearchIndexItem> => {
            const data = entry.data as SearchIndexEntryData;
            const summary = data.summary ?? "";
            const designation = data.designation ?? "";
            const tags = Array.isArray(data.tags) ? data.tags.filter(Boolean) : [];
            const updated = data.updated ?? "";
            const created = data.created ?? "";
            const image = await buildOptimizedImageBundle(data.image ?? null, {
              widths: [320, 640, 960],
              sizes: RESULT_IMAGE_SIZES,
              quality: 84,
              fit: "cover",
            });
            const searchBody = stripMarkdown(entry.body ?? "");
            const searchText = normalizeText(
              [
                data.title,
                summary,
                designation,
                data.type ?? "",
                getSectionLabel(section, locale),
                tags.join(" "),
                searchBody,
              ].join(" ")
            );
            const priority = Number.isFinite(data.priority) ? Number(data.priority) : 9999;
            const updatedTimestamp = parseTimestamp(updated || created);

            return {
              id: `${section}:${entry.slug}`,
              section,
              sectionLabel: getSectionLabel(section, locale),
              sectionRank: SECTION_RANK[section] ?? SECTIONS.findIndex((item) => item.key === section),
              slug: entry.slug,
              href: localizedEntryPath(locale, section, entry.slug),
              title: data.title,
              summary,
              designation,
              type: data.type || getSectionLabel(section, locale),
              tags,
              created,
              updated,
              updatedTimestamp,
              image,
              imagePosition: data.image_position ?? "",
              priority,
              defaultOrder: 0,
              searchText,
            };
          })
      );
    })
  );

  const items = itemsNested
    .flat()
    .sort((left, right) => {
      if (left.priority !== right.priority) return left.priority - right.priority;
      if (left.sectionRank !== right.sectionRank) return left.sectionRank - right.sectionRank;
      if (left.updatedTimestamp !== right.updatedTimestamp) return right.updatedTimestamp - left.updatedTimestamp;
      return left.title.localeCompare(right.title);
    })
    .map((item, index) => ({ ...item, defaultOrder: index }));

  const tagMap = new Map<string, SearchTagCount>();
  for (const item of items) {
    for (const rawTag of item.tags) {
      const key = normalizeText(rawTag);
      if (!key) continue;
      const existing = tagMap.get(key);
      if (existing) {
        existing.count += 1;
        continue;
      }
      tagMap.set(key, {
        key,
        label: rawTag,
        count: 1,
      });
    }
  }

  const tags = [...tagMap.values()].sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count;
    return left.label.localeCompare(right.label);
  });

  return { items, tags };
}
