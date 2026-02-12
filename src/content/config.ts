import { defineCollection, z } from "astro:content";

const entrySchema = z.object({
  title: z.string(),
  type: z.string(),
  summary: z.string(),
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

  image: z.string().optional(),
});

const characters = defineCollection({ schema: entrySchema });
const places = defineCollection({ schema: entrySchema });
const redactory = defineCollection({ schema: entrySchema });
const organizations = defineCollection({ schema: entrySchema });
const artifacts = defineCollection({ schema: entrySchema });
const sigillums = defineCollection({ schema: entrySchema });

export const collections = {
  characters,
  places,
  redactory,
  organizations,
  artifacts,
  sigillums,
};
