const STORAGE_KEY = "wishlist";

/**
 * Browser-only wishlist. Deliberately stored in localStorage rather than the
 * database: the button used to be decorative, and a per-device list is enough
 * to make it real without adding an authenticated endpoint.
 */
export function getWishlist(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    // Private mode or corrupted JSON - behave as an empty wishlist.
    return [];
  }
}

export function isWishlisted(productId: string) {
  return getWishlist().includes(productId);
}

/** Adds or removes the product and returns whether it is now in the wishlist. */
export function toggleWishlist(productId: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const current = getWishlist();
  const exists = current.includes(productId);
  const next = exists ? current.filter((id) => id !== productId) : [...current, productId];

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return exists;
  }

  window.dispatchEvent(new Event("wishlistUpdated"));
  return !exists;
}
