"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SheetClose } from "@/components/ui/sheet";
import { LinkPending } from "@/components/link-pending";
import { buildCategoryTree, categoryHref } from "@/lib/categories";
import type { Category, CategoryNode } from "@/lib/types";

/**
 * Desktop category bar. Top-level groups with sub-categories open a dropdown on
 * hover or keyboard focus; the group itself stays clickable and lists everything
 * underneath it.
 */
export function CategoryNavBar({ categories }: { categories: Category[] }) {
  const tree = buildCategoryTree(categories);
  const pathname = usePathname();

  if (!tree.length) {
    return null;
  }

  const isActive = (group: CategoryNode) =>
    pathname === categoryHref(group.slug) ||
    group.children.some((child) => pathname === categoryHref(child.slug));

  return (
    <nav aria-label="Product categories" className="relative">
      {/* No `overflow` on this row: the hover panels below are absolutely
          positioned children and any scroll container here would clip them. */}
      <ul className="flex min-h-12 flex-wrap items-stretch justify-center gap-x-1 gap-y-1 py-1">
        {tree.map((group) => {
          const active = isActive(group);

          return (
            <li key={group.id} className="group relative flex items-center">
              {group.children.length ? (
                <>
                  <Link
                    href={categoryHref(group.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-purple-700 ${
                      active ? "bg-white text-purple-700 shadow-sm" : "text-stone-700"
                    }`}
                  >
                    {group.name}
                    <ChevronDown
                      className="h-3.5 w-3.5 text-stone-400 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden="true"
                    />
                    <LinkPending className="ml-0 h-3.5 w-3.5 text-purple-600" />
                  </Link>

                  <div className="pointer-events-none absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
                    {/* The panel is capped to the space left below the header and
                        scrolls internally, so groups with many sub-categories are
                        fully reachable instead of being cut off by the viewport. */}
                    <div className="dropdown-scroll max-h-[min(70vh,26rem)] overflow-y-auto overscroll-contain rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                      <Link
                        href={categoryHref(group.slug)}
                        className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50"
                      >
                        All {group.name}
                        <LinkPending className="ml-1.5 inline h-3.5 w-3.5 text-purple-600" />
                      </Link>
                      <div className="my-1 h-px bg-stone-100" />
                      {group.children.map((child) => (
                        <Link
                          key={child.id}
                          href={categoryHref(child.slug)}
                          className={`flex items-center rounded-xl px-3 py-2 text-sm transition-colors hover:bg-purple-50 hover:text-purple-700 ${
                            pathname === categoryHref(child.slug)
                              ? "bg-purple-50 font-medium text-purple-700"
                              : "text-stone-700"
                          }`}
                        >
                          {child.name}
                          <LinkPending className="ml-1.5 inline h-3.5 w-3.5 text-purple-600" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={categoryHref(group.slug)}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-purple-700 ${
                    active ? "bg-white text-purple-700 shadow-sm" : "text-stone-700"
                  }`}
                >
                  {group.name}
                  <LinkPending className="ml-1.5 inline h-3.5 w-3.5 text-purple-600" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Category list for the mobile slide-out menu, with collapsible groups. */
export function CategoryNavMobile({ categories }: { categories: Category[] }) {
  const tree = buildCategoryTree(categories);

  if (!tree.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      {tree.map((group) =>
        group.children.length ? (
          <Collapsible
            key={group.id}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
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
              <div className="flex flex-wrap gap-2 border-t border-stone-100 bg-stone-50/60 px-4 py-3">
                <SheetClose asChild>
                  <Link
                    href={categoryHref(group.slug)}
                    className="rounded-full border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
                  >
                    All {group.name}
                  </Link>
                </SheetClose>
                {group.children.map((child) => (
                  <SheetClose asChild key={child.id}>
                    <Link
                      href={categoryHref(child.slug)}
                      className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 transition hover:border-purple-200 hover:text-purple-700"
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
              <ChevronRight className="h-4 w-4 text-stone-300" />
            </Link>
          </SheetClose>
        )
      )}
    </div>
  );
}
