export const CONTENT_KEYS = [
  "characters",
  "organizations",
  "places",
  "artifacts",
  "redactory",
  "sigillums",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];
