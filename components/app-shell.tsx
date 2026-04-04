"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { EcommerceHeader } from "@/components/ecommerce-header";
import { SiteFooter } from "@/components/site-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname === "/signup";

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideChrome ? <EcommerceHeader /> : null}
      <main className="flex-1">{children}</main>
      {!hideChrome ? <SiteFooter /> : null}
    </div>
  );
}
