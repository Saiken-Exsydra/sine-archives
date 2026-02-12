import { defineCollection, z } from "astro:content";

const entrySchema = z.object({
  title: z.string(),
  type: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["public", "private"]),
  created: z.string(),
  updated: z.string(),
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
