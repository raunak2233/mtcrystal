import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { LinkPending } from "@/components/link-pending";

type ButtonProps = ComponentProps<typeof Button>;

/**
 * A `<Link>` rendered as a button that shows a spinner while the destination is
 * loading. Use this instead of hand-rolling `<Link><Button/></Link>` so every
 * navigation on the site gives immediate feedback.
 */
export function ButtonLink({
  href,
  children,
  prefetch,
  linkClassName,
  ...buttonProps
}: {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  linkClassName?: string;
} & Omit<ButtonProps, "asChild">) {
  return (
    <Link href={href} prefetch={prefetch} className={linkClassName}>
      <Button {...buttonProps}>
        {children}
        <LinkPending />
      </Button>
    </Link>
  );
}
