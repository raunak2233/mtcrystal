import type React from "react";

import { buildPageMetadata } from "@/lib/seo";

// Metadata lives in a layout because the page itself is a client component.
export const metadata = buildPageMetadata({
  title: "My Account",
  description:
    "Your MT Crystals orders, addresses and profile.",
  path: "/account",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
