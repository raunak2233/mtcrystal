import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ButtonLink } from "@/components/button-link";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
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
  categoryHref,
  findCategoryById,
  findCategoryBySlug,
  getCategorySlugScope,
  getChildCategories,
  productMatchesSlugs,
} from "@/lib/categories";
import { PRODUCT_FAQS } from "@/lib/content";
import {
  breadcrumbSchema,
  buildPageMetadata,
  collectionPageSchema,
  itemListSchema,
  toMetaDescription,
} from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await readCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    return buildPageMetadata({
      title: "Category not found",
      description: "This crystal collection is no longer available.",
      path: `/category/${slug}`,
      noIndex: true,
    });
  }

  const parent = category.parentId ? findCategoryById(categories, category.parentId) : null;

  return buildPageMetadata({
    title: `${category.name} Crystal Bracelets`,
    description: toMetaDescription(
      category.description
        ? `${category.description} Shop handcrafted ${category.name.toLowerCase()} crystal bracelets from MT Crystals, energised and delivered across India.`
        : `Shop handcrafted ${category.name.toLowerCase()} crystal bracelets from MT Crystals. 100% natural gemstones, cleansed and energised, delivered across India.`
    ),
    path: `/category/${category.slug}`,
    keywords: [
      `${category.name.toLowerCase()} crystal bracelet`,
      `${category.name.toLowerCase()} gemstone bracelet`,
      ...(parent ? [`${parent.name.toLowerCase()} bracelets`] : []),
      "crystal bracelets India",
      "MT Crystals",
    ],
  });
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

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(parent ? [{ name: parent.name, path: categoryHref(parent.slug) }] : []),
    { name: category.name, path: categoryHref(category.slug) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500"
        >
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

        <div className="mb-8 rounded-3xl border border-stone-200 bg-brand-wash bg-white p-6 sm:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">
            {parent ? `${parent.name} Collection` : "Collection"}
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {category.name} Crystal Bracelets
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">
              {category.description}
            </p>
          ) : null}
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
            {filteredProducts.length === 1 ? "design" : "designs"} available - handcrafted, energised
            and shipped across India.
          </p>
        </div>

        {children.length ? (
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Shop {category.name}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700">All {category.name}</Button>
              {children.map((child) => (
                <ButtonLink key={child.id} href={categoryHref(child.slug)} variant="outline">
                  {child.name}
                </ButtonLink>
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
              <ButtonLink href={categoryHref(parent.slug)} variant="outline">
                All {parent.name}
              </ButtonLink>
              {siblings.map((sibling) => (
                <ButtonLink
                  key={sibling.id}
                  href={categoryHref(sibling.slug)}
                  variant={sibling.id === category.id ? "default" : "outline"}
                  className={sibling.id === category.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {sibling.name}
                </ButtonLink>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="/products" variant="outline">
            Back to All Products
          </ButtonLink>
          <ProductSortLinks basePath={categoryHref(category.slug)} currentSort={sortBy} />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <p className="mb-2 text-xl font-semibold text-gray-900">
              No products in {category.name} yet
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
              We are restocking this collection. Browse the rest of the catalogue, or tell us what you
              are looking for and we will let you know when it lands.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/products" className="bg-purple-600 hover:bg-purple-700">
                View all products
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Notify me
              </ButtonLink>
            </div>
          </div>
        )}
      </div>

      <section className="border-t border-stone-200 bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Buy With Confidence"
            title={`What comes with every ${category.name.toLowerCase()} bracelet`}
            subtitle="Authenticity, energising, packaging and after-sales support - included, not extra."
          />
          <TrustFeatures />
        </div>
      </section>

      <ServiceCities />

      <FaqSection
        faqs={PRODUCT_FAQS}
        eyebrow="Before You Order"
        title="Shipping, payment and sizing"
        className="bg-purple-50/60 py-16 sm:py-20"
      />

      <JsonLd id="schema-breadcrumb" data={breadcrumbSchema(breadcrumbItems)} />
      <JsonLd
        id="schema-collection"
        data={collectionPageSchema(category, filteredProducts.length)}
      />
      <JsonLd
        id="schema-product-list"
        data={itemListSchema(filteredProducts, {
          name: `${category.name} crystal bracelets`,
          path: categoryHref(category.slug),
        })}
      />
    </div>
  );
}
