const INR_NUMBER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/**
 * Single money formatter for the storefront. Keeps the existing "Rs." prefix the
 * rest of the site (and the order emails) already use, and adds Indian digit
 * grouping so four- and five-figure totals stay readable.
 */
export function formatPrice(amount: number) {
  const value = Number.isFinite(amount) ? amount : 0;
  return `Rs. ${INR_NUMBER.format(Math.round(value))}`;
}

/** Bare grouped number, for places that render their own currency label. */
export function formatAmount(amount: number) {
  return INR_NUMBER.format(Number.isFinite(amount) ? Math.round(amount) : 0);
}
