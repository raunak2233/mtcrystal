"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Inline spinner that appears while the enclosing `<Link>` is fetching its
 * destination. `useLinkStatus` only works inside a Link, so every usage must be
 * rendered as a descendant of one.
 *
 * Server-rendered pages here are `force-dynamic`, so a click can sit for a
 * second or two before the new route paints. Without this the button looks
 * inert and the page feels frozen.
 */
export function LinkPending({ className }: { className?: string }) {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <>
      <Loader2
        className={cn("ml-2 h-4 w-4 shrink-0 animate-spin", className)}
        aria-hidden="true"
      />
      <span className="sr-only">Loading</span>
    </>
  );
}

/**
 * Full-tile pending state for cards, where an inline spinner would be lost.
 * Dims the card and centres a spinner over it.
 */
export function LinkPendingOverlay({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <span
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px]",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-purple-600" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
