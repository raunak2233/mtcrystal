import { notFound } from "next/navigation";
import { ProductDetailPageClient } from "@/components/product-detail-page-client";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ServiceCities } from "@/components/service-cities";
import { readCategories, readProducts } from "@/lib/server/store";
import {
  categoryHref,
  findCategoryBySlug,
  findCategoryById,
  getProductCategorySlugs,
  productMatchesSlugs,
} from "@/lib/categories";
import { PRODUCT_FAQS } from "@/lib/content";
import {
  breadcrumbSchema,
  buildPageMetadata,
  productSchema,
  toMetaDescription,
} from "@/lib/seo";

type ProductPageProps = { params: Promise<{ id: string }> };

async function findProduct(idOrSlug: string) {
  const products = await readProducts();
  return products.find((item) => item.slug === idOrSlug || item.id === idOrSlug) || null;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await findProduct(id);

  if (!product) {
    return buildPageMetadata({
      title: "Product not found",
      description: "This crystal bracelet is no longer available.",
      path: `/products/${id}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: product.name,
    description: toMetaDescription(
      `${product.shortDesc || product.description} Buy the ${product.name} crystal bracelet from MT Crystals - natural gemstones, energised before dispatch, delivered across India.`
    ),
    path: `/products/${product.slug}`,
    image: product.image,
    keywords: [
      `${product.name} bracelet`,
      `${product.name} crystal`,
      "buy crystal bracelet online",
      "healing crystal bracelet India",
      "MT Crystals",
    ],
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [products, categories] = await Promise.all([readProducts(), readCategories()]);
  const product = products.find((item) => item.slug === id || item.id === id);

  if (!product) {
    notFound();
  }

  const productSlugs = getProductCategorySlugs(product);
  const categoryLinks = categories
    .filter((category) => productSlugs.includes(category.slug))
    .map((category) => ({ name: category.name, slug: category.slug }));

  // Anything sharing at least one category counts as related, so a bracelet in
  // both "Root Chakra" and "Red" surfaces neighbours from either group.
  const relatedProducts = products
    .filter((item) => item.id !== product.id && productMatchesSlugs(item, productSlugs))
    .slice(0, 4);

  // Breadcrumb mirrors the category the product actually sits in, walking up to
  // the parent group when there is one.
  const primaryCategory = findCategoryBySlug(categories, product.category);
  const primaryParent = primaryCategory?.parentId
    ? findCategoryById(categories, primaryCategory.parentId)
    : null;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(primaryParent
      ? [{ name: primaryParent.name, path: categoryHref(primaryParent.slug) }]
      : []),
    ...(primaryCategory
      ? [{ name: primaryCategory.name, path: categoryHref(primaryCategory.slug) }]
      : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <ProductDetailPageClient
        product={product}
        relatedProducts={relatedProducts}
        categoryLinks={categoryLinks}
      />

      <FaqSection
        faqs={PRODUCT_FAQS}
        eyebrow="Before You Order"
        title="Shipping, payment and sizing"
        className="bg-white py-16 sm:py-20"
      />

      <ServiceCities />

      <JsonLd
        id="schema-product"
        data={productSchema(
          product,
          categoryLinks.map((category) => category.name)
        )}
      />
      <JsonLd id="schema-breadcrumb" data={breadcrumbSchema(breadcrumbItems)} />
    </>
  );
}
