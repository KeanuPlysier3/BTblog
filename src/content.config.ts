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

export const collections = {
  blog: blogCollection,
};
