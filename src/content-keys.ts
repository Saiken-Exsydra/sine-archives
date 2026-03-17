export const CONTENT_KEYS = [
  "characters",
  "organizations",
  "places",
  "apparatus",
  "systems",
  "cosmology",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];
