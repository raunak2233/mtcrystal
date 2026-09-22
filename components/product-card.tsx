"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkPendingOverlay } from "@/components/link-pending";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    shortDesc: string;
    price: number;
    image: string;
    category: string;
    stock?: number;
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
  };
  /** Set on the first row of a listing so the LCP image is not lazy-loaded. */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const outOfStock = typeof product.stock === "number" && product.stock <= 0;
  const lowStock = !outOfStock && typeof product.stock === "number" && product.stock <= 5;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    // The card is a plain container: a stretched overlay link makes the whole
    // tile clickable without nesting the Add button inside an anchor.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-premium-lg">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller ? (
            <Badge className="bg-purple-600 hover:bg-purple-600">Best Seller</Badge>
          ) : null}
          {product.newArrival ? (
            <Badge className="bg-emerald-600 hover:bg-emerald-600">New</Badge>
          ) : null}
        </div>

        {outOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-stone-900/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
              Sold out
            </span>
          </div>
        ) : null}

        <span className="pointer-events-none absolute bottom-3 right-3 flex translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-purple-700 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          View details
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-purple-700">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center after:absolute after:inset-0"
          >
            {product.name}
            <LinkPendingOverlay label={`Opening ${product.name}`} />
          </Link>
        </h3>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-gray-600">
          {product.shortDesc}
        </p>

        {lowStock ? (
          <p className="text-xs font-medium text-amber-600">
            Only {product.stock} left in stock
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold text-purple-700">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            // z-10 keeps this above the stretched link overlay.
            className="relative z-10 bg-purple-600 hover:bg-purple-700"
          >
            <ShoppingCart className="mr-1 h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
