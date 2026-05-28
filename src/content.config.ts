import { defineCollection, z } from "astro:content";
import { CONTENT_KEYS } from "./content-keys";

const createEntrySchema = ({ image }: { image: () => z.ZodTypeAny }) =>
  z.object({
    title: z.string(),
    type: z.string(),
    summary: z.string(),
    affiliation: z.string().optional(),
    age: z.union([z.string(), z.number()]).optional(),
    height: z.union([z.string(), z.number()]).optional(),
    designation: z.string().optional(),
    birth_year: z.union([z.string(), z.number()]).optional(),
    birthplace: z.string().optional(),
    rank: z.string().optional(),
    house: z.string().optional(),
    registry_status: z.string().optional(),
    build: z.string().optional(),
    complexion: z.string().optional(),
    hair: z.string().optional(),
    eyes: z.string().optional(),
    dress: z.string().optional(),
    residence: z.string().optional(),
    occupation: z.string().optional(),
    headquarters: z.string().optional(),
    founded: z.string().optional(),
    jurisdiction: z.string().optional(),
    status_label: z.string().optional(),
    sealing_status: z.string().optional(),
    custody: z.string().optional(),
    known_principle: z.string().optional(),
    domain: z.string().optional(),
    church_name: z.string().optional(),
    principle: z.string().optional(),
    keeper_name: z.string().optional(),
    user_status: z.string().optional(),
    priority: z.number().optional(),
    tags: z.array(z.string().min(1)).min(1),
    status: z.enum(["public", "private"]),
    created: z.preprocess(
      (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
      z.string()
    ),
    updated: z.preprocess(
      (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
      z.string()
    ),
    ref_id: z.string().optional(),
    aliases: z.array(z.string().min(1)).optional(),
    preview: z.string().optional(),
    codex_file: z.string().optional(),
    // Allow incremental rollout: migrated entries use Astro images, untouched ones keep legacy URLs.
    image: z.union([image(), z.string()]).optional(),
    hero_image: z.union([image(), z.string()]).optional(),
    portrait_gallery: z.array(z.union([image(), z.string()])).optional(),
    portrait_gallery_transition: z.enum(["fade", "slide"]).optional(),
    portrait_gallery_autoplay: z.boolean().optional(),
    hero_gallery: z.array(z.union([image(), z.string()])).optional(),
    hero_gallery_transition: z.enum(["fade", "slide"]).optional(),
    hero_gallery_autoplay: z.boolean().optional(),
  });

export const collections = Object.fromEntries(
  CONTENT_KEYS.flatMap((key) => [
    [`${key}_en`, defineCollection({ schema: createEntrySchema })],
    [`${key}_pt_br`, defineCollection({ schema: createEntrySchema })],
  ])
);
