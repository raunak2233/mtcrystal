"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import products from "@/data/products.json";
import categories from "@/data/categories.json";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }
    
    // Filter by search
    const searchParam = searchParams.get("search");
    if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProducts(result);
  }, [searchParams, sortBy]);

  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const currentCategory = categories.find(c => c.slug === categoryParam);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {searchParam ? `Search Results for "${searchParam}"` : 
             currentCategory ? currentCategory.name : "All Products"}
          </h1>
          {currentCategory && (
            <p className="text-gray-600 text-lg">{currentCategory.description}</p>
          )}
          <p className="text-gray-600 mt-2">{filteredProducts.length} products found</p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!categoryParam ? "default" : "outline"}
              onClick={() => window.location.href = "/products"}
              className={!categoryParam ? "bg-purple-600" : ""}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={categoryParam === category.slug ? "default" : "outline"}
                onClick={() => window.location.href = `/products?category=${category.slug}`}
                className={categoryParam === category.slug ? "bg-purple-600" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No products found</p>
            <Button onClick={() => window.location.href = "/products"}>
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
