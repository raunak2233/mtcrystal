import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_SORT,
  ProductSortLinks,
  sortProducts,
} from "@/components/catalog-controls";
import { readCategories, readProducts } from "@/lib/server/store";
import {
  buildCategoryTree,
  categoryHref,
  filterProductsByCategory,
} from "@/lib/categories";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category;
  const searchParam = params.search;
  const sortBy = params.sort || DEFAULT_SORT;

  // Category browsing now lives on its own route. Keep the filter here only when
  // it is combined with a search, so older ?category= links still land somewhere.
  if (categoryParam && !searchParam) {
    const query = sortBy !== DEFAULT_SORT ? `?sort=${sortBy}` : "";
    redirect(`${categoryHref(categoryParam)}${query}`);
  }

  const [products, categories] = await Promise.all([readProducts(), readCategories()]);
  const tree = buildCategoryTree(categories);

  let filteredProducts = categoryParam
    ? filterProductsByCategory(products, categories, categoryParam)
    : [...products];

  if (searchParam) {
    const query = searchParam.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  filteredProducts = sortProducts(filteredProducts, sortBy);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            {searchParam ? `Search Results for "${searchParam}"` : "All Products"}
          </h1>
          <p className="mt-2 text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="mb-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Shop By Category
          </p>
          <div className="space-y-3">
            {tree.map((group) => (
              <div key={group.id} className="flex flex-wrap items-center gap-2">
                <Link href={categoryHref(group.slug)}>
                  <Button variant="outline" className="border-purple-200 text-purple-700">
                    {group.name}
                  </Button>
                </Link>
                {group.children.map((child) => (
                  <Link key={child.id} href={categoryHref(child.slug)}>
                    <Button variant="ghost" size="sm" className="text-stone-600">
                      {child.name}
                    </Button>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {searchParam ? (
            <Link href="/products">
              <Button variant="outline">Clear Search</Button>
            </Link>
          ) : (
            <span />
          )}
          <ProductSortLinks
            basePath="/products"
            currentSort={sortBy}
            preservedParams={{ category: categoryParam, search: searchParam }}
          />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-xl text-gray-600">No products found</p>
            <Link href="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
