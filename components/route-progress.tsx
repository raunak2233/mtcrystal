"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Thin bar across the top of the viewport while a client-side navigation is in
 * flight. App Router gives no global navigation event, so the bar starts on an
 * internal link click or a history pop and completes when the pathname settles.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      tickRef.current = null;
      hideRef.current = null;
      failsafeRef.current = null;
    };

    const finish = () => {
      clearTimers();
      setProgress(100);
      hideRef.current = setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 250);
    };

    const start = () => {
      clearTimers();
      setActive(true);
      setProgress(12);
      // Creep towards 90% so the bar always feels alive, then wait for the route.
      tickRef.current = setInterval(() => {
        setProgress((current) => (current >= 90 ? current : current + (90 - current) * 0.18));
      }, 180);
      failsafeRef.current = setTimeout(finish, 10000);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
        return;
      }

      start();
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", start);
      clearTimers();
    };
  }, []);

  // A settled pathname means the new route is on screen.
  useEffect(() => {
    setProgress((current) => (current > 0 ? 100 : current));
    const timeout = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 250);

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-purple-100">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/**
 * Branded overlay covering the very first paint, removed as soon as React
 * hydrates. Server and first client render match, so there is no mismatch.
 */
export function InitialLoadOverlay() {
  const [hydrated, setHydrated] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const timeout = setTimeout(() => setRemoved(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  if (removed) {
    return null;
  }

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-white transition-opacity duration-300 ${
        hydrated ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="space-y-4 text-center">
        <div className="relative mx-auto h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
        <p className="text-sm font-medium tracking-[0.24em] text-stone-500">MT CRYSTALS</p>
      </div>
    </div>
  );
}
