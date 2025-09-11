"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import products data
import productsData from "@/lib/products.json";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  bulletPoints: string[];
  shortDesc: string;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Get top 3 products
    setProducts((productsData as Product[]).slice(0, 3));
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Featured Products
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Our most popular crystal bracelets, handcrafted with love and
              intention.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="flex justify-center p-6 bg-purple-50">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="mt-4 font-bold text-lg">₹{product.price}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleProductClick(product)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/products">
            <Button variant="outline">View All Products</Button>
          </Link>
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <Image
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                width={180}
                height={180}
                className="object-cover mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">
                {selectedProduct.name}
              </h2>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mb-2">
                {selectedProduct.category}
              </span>
              <p className="text-sm text-gray-500 mb-2">
                {selectedProduct.shortDesc}
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700 text-sm">
                {selectedProduct.bulletPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <p className="font-bold text-lg mb-4">₹{selectedProduct.price}</p>
              <Link
                href={`https://api.whatsapp.com/send?phone=919999492068&text=Hey!%20I%20would%20like%20to%20make%20a%20purchase%20of%20${encodeURIComponent(
                  selectedProduct.name
                )}.`}
                target="_blank"
                className="w-full"
              >
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Proceed to WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
