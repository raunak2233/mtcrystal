import crypto from "crypto";
import type {
  Banner,
  Category,
  OrderAddress,
  OrderItem,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

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
  const extraCategories = Array.isArray(input.categories)
    ? input.categories.map((value) => String(value || "").trim()).filter(Boolean)
    : [];

  return {
    id: input.id?.trim() || createId(),
    slug: slug || createId(),
    name,
    description: input.description?.trim() || "",
    shortDesc: input.shortDesc?.trim() || "",
    category,
    categories: Array.from(
      new Set(category ? [category, ...extraCategories] : extraCategories)
    ),
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
  const parentId = String(input.parentId ?? "").trim();

  return {
    id: input.id?.trim() || slug || createId(),
    name,
    slug,
    description: input.description?.trim() || "",
    parentId: parentId && parentId !== "none" ? parentId : null,
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0,
  };
}

export function validateCategory(category: Category) {
  if (!category.name) return "Category name is required";
  if (!category.slug) return "Category slug is required";
  if (!category.description) return "Category description is required";
  if (category.parentId && category.parentId === category.id) {
    return "A category cannot be its own parent";
  }
  return null;
}

/**
 * Categories nest exactly one level: a group such as "Chakras" holds sub-categories,
 * and those sub-categories cannot hold any of their own.
 */
export function validateCategoryHierarchy(
  category: Category,
  allCategories: Category[]
) {
  const children = allCategories.filter((item) => item.parentId === category.id);

  if (!category.parentId) {
    return null;
  }

  const parent = allCategories.find((item) => item.id === category.parentId);
  if (!parent) {
    return "The selected parent category does not exist";
  }

  if (parent.parentId) {
    return "Sub-categories can only sit under a top-level category";
  }

  if (children.length) {
    return "This category already has sub-categories, so it cannot become a sub-category itself";
  }

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

export function normalizeTestimonial(input: Partial<Testimonial>): Testimonial {
  const rating = Number(input.rating);

  return {
    id: input.id?.trim() || createId(),
    name: input.name?.trim() || "",
    location: input.location?.trim() || "",
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
    message: input.message?.trim() || "",
    product: input.product?.trim() || "",
    image: input.image?.trim() || "",
    reviewDate: input.reviewDate?.trim() || "",
    featured: Boolean(input.featured),
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0,
  };
}

export function validateTestimonial(testimonial: Testimonial) {
  if (!testimonial.name) return "Reviewer name is required";
  if (!testimonial.message) return "Review text is required";
  if (testimonial.rating < 1 || testimonial.rating > 5) return "Rating must be between 1 and 5";
  return null;
}

export function normalizeSettings(input: Partial<SiteSettings>): SiteSettings {
  const text = (value: unknown, fallback: string) => {
    const trimmed = String(value ?? "").trim();
    return trimmed || fallback;
  };
  const optional = (value: unknown) => String(value ?? "").trim();

  return {
    brandTagline: text(input.brandTagline, DEFAULT_SITE_SETTINGS.brandTagline),
    footerAbout: text(input.footerAbout, DEFAULT_SITE_SETTINGS.footerAbout),
    contactEmail: optional(input.contactEmail),
    supportEmail: optional(input.supportEmail),
    phonePrimary: optional(input.phonePrimary),
    phoneSecondary: optional(input.phoneSecondary),
    addressLine1: optional(input.addressLine1),
    addressLine2: optional(input.addressLine2),
    city: optional(input.city),
    state: optional(input.state),
    pincode: optional(input.pincode),
    country: optional(input.country),
    businessHours: optional(input.businessHours),
    facebookUrl: optional(input.facebookUrl),
    instagramUrl: optional(input.instagramUrl),
    twitterUrl: optional(input.twitterUrl),
    youtubeUrl: optional(input.youtubeUrl),
    whatsappUrl: optional(input.whatsappUrl),
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSettings(settings: SiteSettings) {
  if (!settings.contactEmail) {
    return "A contact email is required";
  }

  const emails = [settings.contactEmail, settings.supportEmail].filter(Boolean);
  if (emails.some((email) => !EMAIL_PATTERN.test(email))) {
    return "Please enter valid email addresses";
  }

  if (!settings.phonePrimary) {
    return "A primary phone number is required";
  }

  const links = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.twitterUrl,
    settings.youtubeUrl,
    settings.whatsappUrl,
  ].filter(Boolean);

  if (links.some((link) => !/^https?:\/\//i.test(link))) {
    return "Social links must start with http:// or https://";
  }

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
