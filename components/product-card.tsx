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
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0 relative">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {product.bestSeller && (
              <Badge className="absolute top-2 left-2 bg-purple-600">
                Best Seller
              </Badge>
            )}
            {product.newArrival && (
              <Badge className="absolute top-2 right-2 bg-green-600">
                New
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.shortDesc}</p>
          <div className="flex items-center justify-between w-full mt-2">
            <span className="text-xl font-bold text-purple-600">
              ₹{product.price}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
