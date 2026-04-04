"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/lib/cart";
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
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="relative p-0">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {product.bestSeller ? (
              <Badge className="absolute left-2 top-2 bg-purple-600">
                Best Seller
              </Badge>
            ) : null}
            {product.newArrival ? (
              <Badge className="absolute right-2 top-2 bg-green-600">
                New
              </Badge>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-purple-600">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-600">{product.shortDesc}</p>
          <div className="mt-2 flex w-full items-center justify-between">
            <span className="text-xl font-bold text-purple-600">
              Rs. {product.price}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
