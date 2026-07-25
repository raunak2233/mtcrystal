"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { addToCart } from "@/lib/cart";
import { categoryHref } from "@/lib/categories";
import type { Product } from "@/lib/types";

export function ProductDetailPageClient({
  product,
  relatedProducts,
  categoryLinks = [],
}: {
  product: Product;
  relatedProducts: Product[];
  categoryLinks?: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const productImages = useMemo(
    () => (product.images?.length ? product.images : [product.image]),
    [product.image, product.images]
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setLightboxOpen(true);
  };

  const showPreviousImage = () => {
    setSelectedImage((current) =>
      current === 0 ? productImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setSelectedImage((current) =>
      current === productImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="mb-12 grid gap-8 rounded-lg bg-white p-6 shadow-md md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <button
                type="button"
                className="absolute inset-0"
                onClick={() => openLightbox(selectedImage)}
              >
                <Image
                  src={productImages[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </button>
              {product.bestSeller ? (
                <Badge className="absolute left-4 top-4 bg-purple-600">
                  Best Seller
                </Badge>
              ) : null}
              {product.newArrival ? (
                <Badge className="absolute right-4 top-4 bg-green-600">
                  New Arrival
                </Badge>
              ) : null}
              <button
                type="button"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/75"
                onClick={() => openLightbox(selectedImage)}
              >
                <Expand className="h-4 w-4" />
                Open image
              </button>
            </div>
            {productImages.length > 1 ? (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-purple-600"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.shortDesc}</p>
              {categoryLinks.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {categoryLinks.map((category) => (
                    <Link key={category.slug} href={categoryHref(category.slug)}>
                      <Badge
                        variant="outline"
                        className="border-purple-200 bg-purple-50 text-purple-700 transition hover:bg-purple-100"
                      >
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-purple-600">
                Rs. {product.price}
              </span>
              <Badge variant="outline" className="border-green-600 text-green-600">
                {product.stock} in stock
              </Badge>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Benefits:</h3>
              <ul className="space-y-2">
                {product.bulletPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    handleAddToCart();
                    router.push("/cart");
                  }}
                  variant="default"
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>

              <Button variant="outline" className="w-full" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="mb-3 text-lg font-semibold">Description:</h3>
              <p className="leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div>
            <h2 className="mb-6 text-3xl font-bold">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[80] bg-black/90 px-4 py-6">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-4 flex items-center justify-between text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                {selectedImage + 1} / {productImages.length}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              {productImages.length > 1 ? (
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-0 z-10 rounded-full border border-white/20 bg-black/40 p-3 text-white transition hover:bg-black/60"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              ) : null}
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <Image
                  src={productImages[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              {productImages.length > 1 ? (
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-0 z-10 rounded-full border border-white/20 bg-black/40 p-3 text-white transition hover:bg-black/60"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              ) : null}
            </div>
            {productImages.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-lightbox-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-2xl border ${
                      selectedImage === index
                        ? "border-white"
                        : "border-white/20"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
