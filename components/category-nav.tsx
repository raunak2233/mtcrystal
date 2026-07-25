"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SheetClose } from "@/components/ui/sheet";
import { buildCategoryTree, categoryHref } from "@/lib/categories";
import type { Category } from "@/lib/types";

/**
 * Desktop category bar. Top-level groups with sub-categories open a dropdown on
 * hover or keyboard focus; the group itself stays clickable and lists everything
 * underneath it.
 */
export function CategoryNavBar({ categories }: { categories: Category[] }) {
  const tree = buildCategoryTree(categories);

  return (
    <nav className="flex min-h-12 flex-wrap items-center justify-center gap-x-1 gap-y-1 py-1">
      <Link
        href="/products"
        className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-purple-600"
      >
        All Products
      </Link>

      {tree.map((group) =>
        group.children.length ? (
          <div key={group.id} className="group relative">
            <Link
              href={categoryHref(group.slug)}
              className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-purple-600"
            >
              {group.name}
              <ChevronDown className="h-3.5 w-3.5 text-stone-400 transition-transform duration-200 group-hover:rotate-180" />
            </Link>

            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                <Link
                  href={categoryHref(group.slug)}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50"
                >
                  All {group.name}
                </Link>
                <div className="my-1 h-px bg-stone-100" />
                {group.children.map((child) => (
                  <Link
                    key={child.id}
                    href={categoryHref(child.slug)}
                    className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={group.id}
            href={categoryHref(group.slug)}
            className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-purple-600"
          >
            {group.name}
          </Link>
        )
      )}
    </nav>
  );
}

/** Category list for the mobile slide-out menu, with collapsible groups. */
export function CategoryNavMobile({ categories }: { categories: Category[] }) {
  const tree = buildCategoryTree(categories);

  return (
    <div className="space-y-2">
      {tree.map((group) =>
        group.children.length ? (
          <Collapsible
            key={group.id}
            className="rounded-2xl border border-stone-200 bg-white"
          >
            <div className="flex items-center">
              <SheetClose asChild>
                <Link
                  href={categoryHref(group.slug)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-stone-700 transition hover:text-purple-700"
                >
                  {group.name}
                </Link>
              </SheetClose>
              <CollapsibleTrigger className="group px-4 py-3 text-stone-400 transition hover:text-purple-700">
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                <span className="sr-only">Toggle {group.name} sub-categories</span>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="flex flex-wrap gap-2 border-t border-stone-100 px-4 py-3">
                {group.children.map((child) => (
                  <SheetClose asChild key={child.id}>
                    <Link
                      href={categoryHref(child.slug)}
                      className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 transition hover:border-purple-200 hover:text-purple-700"
                    >
                      {child.name}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SheetClose asChild key={group.id}>
            <Link
              href={categoryHref(group.slug)}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-purple-200 hover:text-purple-700"
            >
              <span>{group.name}</span>
              <span className="text-stone-300">/</span>
            </Link>
          </SheetClose>
        )
      )}
    </div>
  );
}
