import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const CATEGORIES = ["UX", "DESIGN", "DEVELOPMENT", "FEEDBACK"] as const;
export const AUTHORS = ["Pham", "Laura", "Keanu"] as const;

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    author: z.enum(AUTHORS),
    date: z.coerce.date(),
  }),
});

// One JSON file per person per day (src/content/time/<date>-<name>.json); saving the same day again overwrites it.
const timeCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/time" }),
  schema: z.object({
    person: z.enum(AUTHORS),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hours: z.number().min(0).max(24),
    label: z.string().default(""),
    description: z.string().default(""),
  }),
});

export const collections = {
  blog: blogCollection,
  time: timeCollection,
};
