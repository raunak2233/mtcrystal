"use client";

import { usePathname } from "next/navigation";
import type React from "react";

/**
 * Header and footer arrive as slots so they can stay server components and read
 * settings/categories directly, while this shell keeps the client-side rule that
 * hides the chrome on the auth screens.
 */
export function AppShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname === "/login" || pathname === "/signup";

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideChrome ? header : null}
      <main className="flex-1">{children}</main>
      {!hideChrome ? footer : null}
    </div>
  );
}
