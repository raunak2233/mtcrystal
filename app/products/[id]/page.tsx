import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductDetailPageClient } from "@/components/product-detail-page-client";
import { readCategories, readProducts } from "@/lib/server/store";
import { getProductCategorySlugs, productMatchesSlugs } from "@/lib/categories";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [products, categories] = await Promise.all([readProducts(), readCategories()]);
  const product = products.find((item) => item.slug === id || item.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
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

  return (
    <ProductDetailPageClient
      product={product}
      relatedProducts={relatedProducts}
      categoryLinks={categoryLinks}
    />
  );
}
