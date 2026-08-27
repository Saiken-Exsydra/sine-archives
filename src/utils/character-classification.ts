export const CHARACTER_ANCHOR_DEPTHS = ["Shallow", "Deep", "Abyssal"] as const;

export type CharacterAnchorDepth = (typeof CHARACTER_ANCHOR_DEPTHS)[number];

export type CharacterClassificationVisual = {
  kind: "anchor-depth" | "system";
  label: string;
  depth: CharacterAnchorDepth;
  src: string;
};

type SystemVisual = Omit<CharacterClassificationVisual, "depth">;

const ANCHOR_DEPTH_VISUALS: Record<CharacterAnchorDepth, CharacterClassificationVisual> = {
  Shallow: {
    kind: "anchor-depth",
    label: "Shallow Anchor",
    depth: "Shallow",
    src: "/uploads/Shallow_Anchor_symbol.png",
  },
  Deep: {
    kind: "anchor-depth",
    label: "Deep Anchor",
    depth: "Deep",
    src: "/uploads/Deep_Anchor_symbol.png",
  },
  Abyssal: {
    kind: "anchor-depth",
    label: "Abyssal Anchor",
    depth: "Abyssal",
    src: "/uploads/Abyssal_Anchor_symbol.png",
  },
};

const SYSTEM_VISUALS: Record<string, SystemVisual> = {
  redactory: {
    kind: "system",
    label: "Redactory",
    src: "/uploads/observatory-white/Redactory_symbol.png",
  },
  bloom: {
    kind: "system",
    label: "Bloom",
    src: "/uploads/observatory-white/Bloom_symbol.png",
  },
  harmonics: {
    kind: "system",
    label: "Harmonics",
    src: "/uploads/observatory-white/Harmonics_symbol.png",
  },
  divination: {
    kind: "system",
    label: "Divination",
    src: "/uploads/observatory-white/Divination_symbol.png",
  },
};

const SYSTEM_ALIASES: Record<string, keyof typeof SYSTEM_VISUALS> = {
  harmonic: "harmonics",
  harmonix: "harmonics",
};

function normalizeClassificationKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAnchorDepthVisual(value: unknown): CharacterClassificationVisual | null {
  const normalized = String(value ?? "").trim().toLowerCase();
  const depth = CHARACTER_ANCHOR_DEPTHS.find((candidate) => candidate.toLowerCase() === normalized);
  return depth ? ANCHOR_DEPTH_VISUALS[depth] : null;
}

export function getCharacterClassificationVisual({
  anchorDepth,
  system,
}: {
  anchorDepth?: unknown;
  system?: unknown;
}): CharacterClassificationVisual | SystemVisual | null {
  const anchorVisual = getAnchorDepthVisual(anchorDepth);
  if (anchorVisual) return anchorVisual;

  const normalizedSystem = normalizeClassificationKey(system);
  const systemKey = SYSTEM_ALIASES[normalizedSystem] ?? normalizedSystem;
  return SYSTEM_VISUALS[systemKey] ?? null;
}
