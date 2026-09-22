import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LinkPending } from "@/components/link-pending";

/**
 * Shared section header so every band on the site uses the same eyebrow /
 * title / subtitle rhythm instead of each page inventing its own.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  action?: { href: string; label: string };
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-4 ${
        centered
          ? "items-center text-center"
          : "items-start sm:flex-row sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <p
            className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-purple-600 ${
              centered ? "justify-center" : ""
            }`}
          >
            <span className="h-px w-6 bg-purple-300" aria-hidden="true" />
            {eyebrow}
            {centered ? <span className="h-px w-6 bg-purple-300" aria-hidden="true" /> : null}
          </p>
        ) : null}
        <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-purple-700 transition-colors hover:text-purple-900"
        >
          {action.label}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
          <LinkPending className="ml-0 h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
