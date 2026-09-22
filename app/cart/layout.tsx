import type React from "react";

import { buildPageMetadata } from "@/lib/seo";

// Metadata lives in a layout because the page itself is a client component.
export const metadata = buildPageMetadata({
  title: "Your Cart",
  description:
    "Review the crystal bracelets in your MT Crystals cart before checkout.",
  path: "/cart",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
