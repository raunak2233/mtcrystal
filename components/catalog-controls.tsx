import Link from "next/link";
import { Button } from "@/components/ui/button";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
] as const;

export const DEFAULT_SORT = "featured";

export function sortProducts<T extends { price: number; name: string }>(
  products: T[],
  sortBy: string
) {
  const sorted = [...products];

  if (sortBy === "price-low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

/**
 * Sort buttons that preserve whatever query the current page already carries.
 * The default sort is omitted from the URL so canonical links stay clean.
 */
export function ProductSortLinks({
  basePath,
  currentSort,
  preservedParams = {},
}: {
  basePath: string;
  currentSort: string;
  preservedParams?: Record<string, string | undefined>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SORT_OPTIONS.map((option) => {
        const params = new URLSearchParams();
        Object.entries(preservedParams).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          }
        });
        if (option.value !== DEFAULT_SORT) {
          params.set("sort", option.value);
        }

        const query = params.toString();
        const isActive = currentSort === option.value;

        return (
          <Link key={option.value} href={query ? `${basePath}?${query}` : basePath}>
            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {option.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
