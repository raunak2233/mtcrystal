import type React from "react";

import { buildPageMetadata } from "@/lib/seo";

// Metadata lives in a layout because the page itself is a client component.
export const metadata = buildPageMetadata({
  title: "Crystal Bracelet Gallery",
  description:
    "A closer look at MT Crystals bracelets - bead detail, colour variation and how our pieces look on the wrist.",
  path: "/gallery",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
