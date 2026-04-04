import crypto from "crypto";
import type {
  Banner,
  Category,
  OrderAddress,
  OrderItem,
  Product,
} from "@/lib/types";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createId() {
  return crypto.randomUUID();
}

export function normalizeProduct(input: Partial<Product>): Product {
  const name = input.name?.trim() || "";
  const slug = slugify(input.slug || name || input.id || "");
  const category = input.category?.trim() || "";
  const image = input.image?.trim() || "";
  const images = Array.isArray(input.images)
    ? input.images.map((value) => value.trim()).filter(Boolean)
    : [];
  const bulletPoints = Array.isArray(input.bulletPoints)
    ? input.bulletPoints.map((value) => value.trim()).filter(Boolean)
    : [];

  return {
    id: input.id?.trim() || createId(),
    slug: slug || createId(),
    name,
    description: input.description?.trim() || "",
    shortDesc: input.shortDesc?.trim() || "",
    category,
    price: Number(input.price || 0),
    image,
    images: images.length ? images : image ? [image] : [],
    stock: Number(input.stock || 0),
    featured: Boolean(input.featured),
    newArrival: Boolean(input.newArrival),
    bestSeller: Boolean(input.bestSeller),
    bulletPoints,
    createdAt: input.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function validateProduct(product: Product) {
  if (!product.name) return "Product name is required";
  if (!product.slug) return "Product slug is required";
  if (!product.description) return "Product description is required";
  if (!product.shortDesc) return "Product short description is required";
  if (!product.category) return "Product category is required";
  if (!product.image) return "Product image is required";
  if (Number.isNaN(product.price) || product.price <= 0) return "Product price must be greater than 0";
  if (Number.isNaN(product.stock) || product.stock < 0) return "Product stock cannot be negative";
  return null;
}

export function normalizeCategory(input: Partial<Category>): Category {
  const name = input.name?.trim() || "";
  const slug = slugify(input.slug || name);

  return {
    id: input.id?.trim() || slug || createId(),
    name,
    slug,
    description: input.description?.trim() || "",
  };
}

export function validateCategory(category: Category) {
  if (!category.name) return "Category name is required";
  if (!category.slug) return "Category slug is required";
  if (!category.description) return "Category description is required";
  return null;
}

export function normalizeBanner(input: Partial<Banner>): Banner {
  return {
    id: input.id?.trim() || createId(),
    title: input.title?.trim() || "",
    subtitle: input.subtitle?.trim() || "",
    image: input.image?.trim() || "",
    ctaText: input.ctaText?.trim() || "",
    ctaLink: input.ctaLink?.trim() || "/products",
    secondaryCtaText: input.secondaryCtaText?.trim() || "",
    secondaryCtaLink: input.secondaryCtaLink?.trim() || "",
  };
}

export function validateBanner(banner: Banner) {
  if (!banner.image) return "Banner image is required";
  return null;
}

export function validateOrderAddress(address: OrderAddress) {
  if (!address) {
    return false;
  }

  const requiredFields = [
    address.firstName,
    address.lastName,
    address.email,
    address.phone,
    address.address,
    address.city,
    address.state,
    address.pincode,
  ];

  return requiredFields.every((value) => String(value || "").trim().length > 0);
}

export function validateOrderItems(items: OrderItem[]) {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.productId &&
        item.name &&
        item.image &&
        Number(item.price) >= 0 &&
        Number(item.quantity) > 0
    )
  );
}
