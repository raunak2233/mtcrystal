import type {
  AccountUser,
  Banner,
  Category,
  Order,
  Product,
  SessionUser,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload as T;
}

export async function apiGet<T>(url: string) {
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });
  return parseResponse<T>(response);
}

export async function apiSend<T>(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}

export async function apiUpload<T>(url: string, formData: FormData) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return parseResponse<T>(response);
}

export async function getCurrentUser() {
  try {
    return await apiGet<{ user: SessionUser }>("/api/auth/me");
  } catch {
    return { user: null as SessionUser | null };
  }
}

export async function getAccount() {
  return apiGet<{ user: AccountUser }>("/api/account");
}

export async function updateAccount(body: Pick<AccountUser, "name" | "phone" | "addresses">) {
  return apiSend<{ user: AccountUser }>("/api/account", "PUT", body);
}

export async function getProducts() {
  return apiGet<{ products: Product[] }>("/api/products");
}

export async function getCategories() {
  return apiGet<{ categories: Category[] }>("/api/categories");
}

export async function getBanners() {
  return apiGet<{ banners: Banner[] }>("/api/banners");
}

export async function getTestimonials() {
  return apiGet<{ testimonials: Testimonial[] }>("/api/testimonials");
}

export async function getSettings() {
  return apiGet<{ settings: SiteSettings }>("/api/settings");
}

export async function getOrders(scope: "visible" | "mine" = "visible") {
  const suffix = scope === "mine" ? "?scope=mine" : "";
  return apiGet<{ orders: Order[] }>(`/api/orders${suffix}`);
}
