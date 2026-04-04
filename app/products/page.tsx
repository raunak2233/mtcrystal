import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { readCategories, readProducts } from "@/lib/server/store";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const products = await readProducts();
  const categories = await readCategories();
  const categoryParam = params.category;
  const searchParam = params.search;
  const sortBy = params.sort || "featured";

  let filteredProducts = [...products];

  if (categoryParam) {
    filteredProducts = filteredProducts.filter((product) => product.category === categoryParam);
  }

  if (searchParam) {
    const query = searchParam.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const currentCategory = categories.find((category) => category.slug === categoryParam);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            {searchParam
              ? `Search Results for "${searchParam}"`
              : currentCategory
                ? currentCategory.name
                : "All Products"}
          </h1>
          {currentCategory ? <p className="text-lg text-gray-600">{currentCategory.description}</p> : null}
          <p className="mt-2 text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Link href="/products">
              <Button variant={!categoryParam ? "default" : "outline"} className={!categoryParam ? "bg-purple-600" : ""}>
                All
              </Button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Button variant={categoryParam === category.slug ? "default" : "outline"} className={categoryParam === category.slug ? "bg-purple-600" : ""}>
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "featured", label: "Featured" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "name", label: "Name: A to Z" },
            ].map((option) => {
              const params = new URLSearchParams();
              if (categoryParam) params.set("category", categoryParam);
              if (searchParam) params.set("search", searchParam);
              if (option.value !== "featured") params.set("sort", option.value);
              const href = params.toString() ? `/products?${params.toString()}` : "/products";

              return (
                <Link key={option.value} href={href}>
                  <Button variant={sortBy === option.value ? "default" : "outline"} className={sortBy === option.value ? "bg-purple-600" : ""}>
                    {option.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-xl text-gray-600">No products found</p>
            <Link href="/products"><Button>View All Products</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
