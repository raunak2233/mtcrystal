import type { Category } from "@/lib/types";

/**
 * Returns the slugs a product was tagged with that no category actually owns,
 * so the API can reject typos instead of creating unreachable products.
 */
export function findUnknownCategorySlugs(slugs: string[], categories: Category[]) {
  const known = new Set(categories.map((category) => category.slug));
  return Array.from(new Set(slugs.filter((slug) => slug && !known.has(slug))));
}
