"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkPending } from "@/components/link-pending";
import { buildCategoryTree, categoryHref } from "@/lib/categories";
import type { Category } from "@/lib/types";

/**
 * Compact, swipeable top-level category rail for small screens, where the
 * hover-driven desktop bar is hidden. Sub-categories stay in the slide-out menu.
 */
export function CategoryStrip({ categories }: { categories: Category[] }) {
  const tree = buildCategoryTree(categories);
  const pathname = usePathname();

  if (!tree.length) {
    return null;
  }

  return (
    <nav
      aria-label="Browse categories"
      className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 py-2.5"
    >
      <Link
        href="/products"
        className={`inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
          pathname === "/products"
            ? "border-purple-300 bg-purple-600 text-white"
            : "border-stone-200 bg-white text-stone-700"
        }`}
      >
        Shop All
        <LinkPending className="ml-1 inline h-3 w-3" />
      </Link>
      {tree.map((group) => {
        const active =
          pathname === categoryHref(group.slug) ||
          group.children.some((child) => pathname === categoryHref(child.slug));

        return (
          <Link
            key={group.id}
            href={categoryHref(group.slug)}
            className={`inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              active
                ? "border-purple-300 bg-purple-600 text-white"
                : "border-stone-200 bg-white text-stone-700"
            }`}
          >
            {group.name}
            <LinkPending className="ml-1 inline h-3 w-3" />
          </Link>
        );
      })}
    </nav>
  );
}
