import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_SORT,
  ProductSortLinks,
  sortProducts,
} from "@/components/catalog-controls";
import { readCategories, readProducts } from "@/lib/server/store";
import {
  categoryHref,
  findCategoryById,
  findCategoryBySlug,
  getCategorySlugScope,
  getChildCategories,
  productMatchesSlugs,
} from "@/lib/categories";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = findCategoryBySlug(await readCategories(), slug);

  if (!category) {
    return { title: "Category not found - MT Crystals" };
  }

  return {
    title: `${category.name} - MT Crystals`,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const sortBy = sort || DEFAULT_SORT;

  const [products, categories] = await Promise.all([readProducts(), readCategories()]);
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    notFound();
  }

  const parent = category.parentId ? findCategoryById(categories, category.parentId) : null;
  const children = getChildCategories(categories, category.id);
  // A sub-category page offers its siblings so shoppers can hop across the group.
  const siblings = parent ? getChildCategories(categories, parent.id) : [];
  const scope = getCategorySlugScope(categories, category);
  const filteredProducts = sortProducts(
    products.filter((product) => productMatchesSlugs(product, scope)),
    sortBy
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <Link href="/" className="transition-colors hover:text-purple-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="transition-colors hover:text-purple-600">
            Products
          </Link>
          {parent ? (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={categoryHref(parent.slug)}
                className="transition-colors hover:text-purple-600"
              >
                {parent.name}
              </Link>
            </>
          ) : null}
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">{category.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{category.name}</h1>
          {category.description ? (
            <p className="text-lg text-gray-600">{category.description}</p>
          ) : null}
          <p className="mt-2 text-gray-600">{filteredProducts.length} products found</p>
        </div>

        {children.length ? (
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Shop {category.name}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700">All {category.name}</Button>
              {children.map((child) => (
                <Link key={child.id} href={categoryHref(child.slug)}>
                  <Button variant="outline">{child.name}</Button>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {!children.length && siblings.length > 1 && parent ? (
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              More in {parent.name}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href={categoryHref(parent.slug)}>
                <Button variant="outline">All {parent.name}</Button>
              </Link>
              {siblings.map((sibling) => (
                <Link key={sibling.id} href={categoryHref(sibling.slug)}>
                  <Button
                    variant={sibling.id === category.id ? "default" : "outline"}
                    className={sibling.id === category.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {sibling.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link href="/products">
            <Button variant="outline">Back to All Products</Button>
          </Link>
          <ProductSortLinks basePath={categoryHref(category.slug)} currentSort={sortBy} />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-xl text-gray-600">
              No products in {category.name} yet
            </p>
            <Link href="/products">
              <Button>View All Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
