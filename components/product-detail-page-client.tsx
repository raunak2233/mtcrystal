"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  RefreshCcw,
  ShieldCheck,
  Loader2,
  ShoppingCart,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { addToCart } from "@/lib/cart";
import { categoryHref } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { isWishlisted, toggleWishlist } from "@/lib/wishlist";
import { RITUAL_STEPS } from "@/lib/content";
import type { Product } from "@/lib/types";

const ASSURANCES = [
  { icon: Truck, title: "Free delivery above Rs. 999", detail: "Dispatched in 24-48 hrs, tracked" },
  { icon: ShieldCheck, title: "Secure payment", detail: "UPI, cards, net banking or COD" },
  { icon: BadgeCheck, title: "100% natural stones", detail: "Checked before stringing" },
  { icon: RefreshCcw, title: "Damage replacement", detail: "Report within 48 hrs of delivery" },
];

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
  const [wishlisted, setWishlisted] = useState(false);
  // "Buy now" adds to the cart and then navigates; the transition keeps the
  // button in a visible pending state until the cart route paints.
  const [buyNowPending, startBuyNow] = useTransition();
  const productImages = useMemo(
    () => (product.images?.length ? product.images : [product.image]),
    [product.image, product.images]
  );
  const outOfStock = product.stock <= 0;
  const maxQuantity = Math.max(1, product.stock);

  // Wishlist lives in localStorage, so it can only be read after hydration.
  useEffect(() => {
    setWishlisted(isWishlisted(product.id));
  }, [product.id]);

  const handleAddToCart = () => {
    if (outOfStock) {
      toast.error("This bracelet is out of stock right now");
      return;
    }

    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    const next = toggleWishlist(product.id);
    setWishlisted(next);
    toast.success(next ? "Saved to your wishlist" : "Removed from your wishlist");
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
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500"
        >
          <Link href="/" className="transition-colors hover:text-purple-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link href="/products" className="transition-colors hover:text-purple-600">
            Products
          </Link>
          {categoryLinks[0] ? (
            <>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <Link
                href={categoryHref(categoryLinks[0].slug)}
                className="transition-colors hover:text-purple-600"
              >
                {categoryLinks[0].name}
              </Link>
            </>
          ) : null}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-gray-900">{product.name}</span>
        </nav>

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

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="text-4xl font-bold text-purple-700">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">Inclusive of all taxes</span>
              {outOfStock ? (
                <Badge variant="outline" className="border-stone-400 text-stone-600">
                  Out of stock
                </Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  Only {product.stock} left
                </Badge>
              ) : (
                <Badge variant="outline" className="border-green-600 text-green-600">
                  In stock
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-4 w-4 text-purple-600" aria-hidden="true" />
                Why people wear it
              </h2>
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
                <span id="quantity-label" className="font-semibold">
                  Quantity:
                </span>
                <div
                  className="flex items-center gap-2"
                  role="group"
                  aria-labelledby="quantity-label"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Decrease quantity"
                    disabled={outOfStock || quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold" aria-live="polite">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Increase quantity"
                    disabled={outOfStock || quantity >= maxQuantity}
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                  Add to cart
                </Button>
                <Button
                  onClick={() => {
                    if (outOfStock) {
                      toast.error("This bracelet is out of stock right now");
                      return;
                    }
                    handleAddToCart();
                    startBuyNow(() => {
                      router.push("/cart");
                    });
                  }}
                  disabled={outOfStock || buyNowPending}
                  variant="default"
                  className="flex-1"
                  size="lg"
                >
                  {buyNowPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Taking you to cart
                    </>
                  ) : (
                    "Buy now"
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                className={`w-full ${wishlisted ? "border-pink-300 bg-pink-50 text-pink-700" : ""}`}
                size="lg"
                onClick={handleToggleWishlist}
                aria-pressed={wishlisted}
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${wishlisted ? "fill-pink-500 text-pink-500" : ""}`}
                  aria-hidden="true"
                />
                {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
              </Button>

              <ul className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:grid-cols-2">
                {ASSURANCES.map(({ icon: Icon, title, detail }) => (
                  <li key={title} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900">{title}</span>
                      <span className="block text-xs text-gray-600">{detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h2 className="mb-3 text-lg font-semibold">About this bracelet</h2>
              <p className="leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <SectionHeading
            eyebrow="Wear It Well"
            title={`Getting the most from your ${product.name}`}
            subtitle="Four small habits that keep the stone clear and the intention alive."
            align="left"
          />
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RITUAL_STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl bg-purple-50/60 p-5">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mb-1.5 font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {relatedProducts.length > 0 ? (
          <section aria-labelledby="related-products">
            <SectionHeading
              eyebrow="You May Also Like"
              title="Pairs well with"
              subtitle="Bracelets from the same intention, chosen by shoppers who bought this one."
              align="left"
              action={{ href: "/products", label: "See the full catalogue" }}
            />
            <h2 id="related-products" className="sr-only">
              Related products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
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
