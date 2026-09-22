import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { LinkPendingOverlay } from "@/components/link-pending";
import { SectionHeading } from "@/components/section-heading";
import { buildCategoryTree, categoryHref, productMatchesSlugs } from "@/lib/categories";
import type { Category, Product } from "@/lib/types";

/**
 * "Shop by intention" grid. Each tile borrows the first product image in the
 * group so the section stays visual without needing separate category artwork
 * that an admin would have to maintain.
 */
export function CategoryShowcase({
  categories,
  products,
  limit = 8,
}: {
  categories: Category[];
  products: Product[];
  limit?: number;
}) {
  const tree = buildCategoryTree(categories);

  if (!tree.length) {
    return null;
  }

  // Fallback pool so a group with no products of its own still shows a real
  // crystal photo instead of an empty gradient. Walking the pool and skipping
  // images already on screen keeps the grid from repeating the same bracelet,
  // and the order is derived from the data so it stays stable across renders.
  const imagePool = Array.from(
    new Set(products.map((product) => product.image).filter(Boolean))
  );
  const usedImages = new Set<string>();
  let fallbackCursor = 0;

  const nextFallbackImage = () => {
    if (!imagePool.length) {
      return null;
    }

    for (let step = 0; step < imagePool.length; step += 1) {
      const candidate = imagePool[(fallbackCursor + step) % imagePool.length];
      if (!usedImages.has(candidate)) {
        fallbackCursor = (fallbackCursor + step + 1) % imagePool.length;
        return candidate;
      }
    }

    // Every image is already used - accept a repeat rather than a blank tile.
    const candidate = imagePool[fallbackCursor % imagePool.length];
    fallbackCursor += 1;
    return candidate;
  };

  const allTiles = tree.map((group) => {
    const scope = [group.slug, ...group.children.map((child) => child.slug)];
    const matches = products.filter((product) => productMatchesSlugs(product, scope));
    const ownImage = matches.find((product) => product.image)?.image || null;
    const image = ownImage || nextFallbackImage();

    if (image) {
      usedImages.add(image);
    }

    return {
      id: group.id,
      name: group.name,
      slug: group.slug,
      description: group.description,
      count: matches.length,
      image,
    };
  });

  // Groups that actually have stock come first, so the grid never leads with a
  // tile that opens onto an empty collection page.
  const stocked = allTiles.filter((tile) => tile.count > 0);
  const tiles = (stocked.length >= 4 ? stocked : allTiles).slice(0, limit);

  if (!tiles.length) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Shop By Intention"
          title="Find the crystal for what you need right now"
          subtitle="Calm, courage, love, protection or abundance - start with the feeling you want more of and we will point you to the stone."
          align="left"
          action={{ href: "/products", label: "Browse everything" }}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              href={categoryHref(tile.slug)}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg sm:p-5"
            >
              {/* Gradient stays behind the photo so a missing or slow image still
                  renders as a branded tile rather than a grey box. */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200" />
              {tile.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin images come from an external host with the unoptimized loader
                <img
                  src={tile.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <LinkPendingOverlay label={`Opening ${tile.name}`} className="rounded-3xl" />

              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100">
                  {tile.count > 0
                    ? `${tile.count} ${tile.count === 1 ? "design" : "designs"}`
                    : "Explore"}
                </p>
                <h3 className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-white sm:text-xl">
                  {tile.name}
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </h3>
                {tile.description ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
                    {tile.description}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
