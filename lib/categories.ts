import type { Category, CategoryNode, Product } from "@/lib/types";

export function categoryHref(slug: string) {
  return `/category/${slug}`;
}

function compareCategories(a: Category, b: Category) {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }

  return a.name.localeCompare(b.name);
}

/**
 * Groups a flat category list into top-level groups with their children.
 * A category whose parent no longer exists is promoted to top level so it never
 * disappears from navigation.
 */
export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const isTopLevel = (category: Category) =>
    !category.parentId || !byId.has(category.parentId);

  return categories
    .filter(isTopLevel)
    .sort(compareCategories)
    .map((parent) => ({
      ...parent,
      children: categories
        .filter((category) => !isTopLevel(category) && category.parentId === parent.id)
        .sort(compareCategories),
    }));
}

export function getTopLevelCategories(categories: Category[]) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  return categories
    .filter((category) => !category.parentId || !byId.has(category.parentId))
    .sort(compareCategories);
}

export function getChildCategories(categories: Category[], parentId: string) {
  return categories
    .filter((category) => category.parentId === parentId)
    .sort(compareCategories);
}

export function findCategoryBySlug(categories: Category[], slug: string) {
  return categories.find((category) => category.slug === slug) || null;
}

export function findCategoryById(categories: Category[], id: string) {
  return categories.find((category) => category.id === id) || null;
}

/**
 * The slugs a category page should match: its own, plus its children's when it
 * is a top-level group. Opening "Chakras" therefore lists every chakra product.
 */
export function getCategorySlugScope(categories: Category[], category: Category) {
  return [
    category.slug,
    ...getChildCategories(categories, category.id).map((child) => child.slug),
  ];
}

export function getProductCategorySlugs(product: Pick<Product, "category" | "categories">) {
  const slugs = Array.isArray(product.categories) ? product.categories : [];
  return slugs.length ? slugs : product.category ? [product.category] : [];
}

export function productMatchesSlugs(
  product: Pick<Product, "category" | "categories">,
  slugs: string[]
) {
  const productSlugs = new Set(getProductCategorySlugs(product));
  return slugs.some((slug) => productSlugs.has(slug));
}

export function filterProductsByCategory<T extends Pick<Product, "category" | "categories">>(
  products: T[],
  categories: Category[],
  slug: string
) {
  const category = findCategoryBySlug(categories, slug);
  const scope = category ? getCategorySlugScope(categories, category) : [slug];
  return products.filter((product) => productMatchesSlugs(product, scope));
}
