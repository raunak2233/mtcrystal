import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductDetailPageClient } from "@/components/product-detail-page-client";
import { readProducts } from "@/lib/server/store";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await readProducts();
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

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return <ProductDetailPageClient product={product} relatedProducts={relatedProducts} />;
}
