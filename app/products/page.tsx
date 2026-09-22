import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, PackageSearch, SlidersHorizontal, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { ButtonLink } from "@/components/button-link";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { RitualGuide } from "@/components/ritual-guide";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCities } from "@/components/service-cities";
import { TrustFeatures } from "@/components/trust-features";
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
import { PRODUCT_FAQS } from "@/lib/content";
import {
  breadcrumbSchema,
  buildPageMetadata,
  itemListSchema,
  toMetaDescription,
} from "@/lib/seo";

type ProductsSearchParams = { category?: string; search?: string; sort?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const { search } = await searchParams;

  if (search) {
    return buildPageMetadata({
      title: `Search results for "${search}"`,
      description: toMetaDescription(
        `Crystal bracelets matching "${search}" at MT Crystals. Natural gemstones, cleansed and energised, with pan-India delivery.`
      ),
      path: `/products?search=${encodeURIComponent(search)}`,
      // Search result pages are thin and infinite in number - keep them out of
      // the index but let the links through to the products they list.
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: "All Crystal Bracelets",
    description:
      "Browse every handcrafted crystal bracelet from MT Crystals - rose quartz, amethyst, tiger eye, black tourmaline and more. 100% natural stones, energised before dispatch, delivered across India.",
    path: "/products",
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
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
        product.shortDesc.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  filteredProducts = sortProducts(filteredProducts, sortBy);

  const heading = searchParam ? `Search results for "${searchParam}"` : "All crystal bracelets";
  const bestSellerCount = products.filter((product) => product.bestSeller).length;
  const newArrivalCount = products.filter((product) => product.newArrival).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-stone-200 bg-brand-wash bg-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500"
          >
            <Link href="/" className="transition-colors hover:text-purple-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium text-gray-900">Products</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr] lg:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                The Full Collection
              </p>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {heading}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">
                Every bracelet is strung by hand with 100% natural gemstone beads, cleansed and
                energised before it is packed, and shipped tracked across India. Filter by intention
                below or sort by what suits you.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Designs", value: products.length },
                { label: "Best sellers", value: bestSellerCount },
                { label: "New arrivals", value: newArrivalCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse rounded-2xl border border-stone-200 bg-white/80 px-3 py-4 shadow-sm backdrop-blur"
                >
                  <dt className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-bold text-purple-700">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        {tree.length ? (
          <section aria-labelledby="shop-by-category" className="mb-10">
            <h2
              id="shop-by-category"
              className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Shop by category
            </h2>
            <div className="space-y-3">
              {tree.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-3"
                >
                  <ButtonLink
                    href={categoryHref(group.slug)}
                    variant="outline"
                    size="sm"
                    className="border-purple-200 bg-purple-50 font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    {group.name}
                  </ButtonLink>
                  {group.children.map((child) => (
                    <ButtonLink
                      key={child.id}
                      href={categoryHref(child.slug)}
                      variant="ghost"
                      size="sm"
                      className="text-stone-600"
                    >
                      {child.name}
                    </ButtonLink>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            {searchParam ? (
              <ButtonLink href="/products" variant="outline" size="sm">
                Clear search
              </ButtonLink>
            ) : null}
          </div>
          <ProductSortLinks
            basePath="/products"
            currentSort={sortBy}
            preservedParams={{ category: categoryParam, search: searchParam }}
          />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <PackageSearch className="mx-auto mb-4 h-10 w-10 text-stone-300" aria-hidden="true" />
            <p className="mb-2 text-xl font-semibold text-gray-900">No products found</p>
            <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
              {searchParam
                ? `Nothing matched "${searchParam}". Try a stone name such as amethyst or rose quartz, or browse by intention.`
                : "This selection is empty right now. Browse the full collection instead."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/products" className="bg-purple-600 hover:bg-purple-700">
                View all products
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Ask us what to pick
              </ButtonLink>
            </div>
          </div>
        )}
      </div>

      <section className="border-t border-stone-200 bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Buy With Confidence"
            title="What comes with every order"
            subtitle="Authenticity, energising, packaging and after-sales support - included, not extra."
          />
          <TrustFeatures />
        </div>
      </section>

      <RitualGuide />

      <ServiceCities />

      <FaqSection
        faqs={PRODUCT_FAQS}
        eyebrow="Before You Order"
        title="Shipping, payment and sizing"
        subtitle="The questions we get asked most while people are deciding."
        className="bg-purple-50/60 py-16 sm:py-20"
      />

      <JsonLd
        id="schema-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <JsonLd
        id="schema-product-list"
        data={itemListSchema(filteredProducts, {
          name: heading,
          path: "/products",
        })}
      />
    </div>
  );
}
