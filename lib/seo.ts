import type { Metadata } from "next";
import type { Category, Product, SiteSettings } from "@/lib/types";
import { formatSettingsAddress, getSocialLinks } from "@/lib/site-settings";

/**
 * Canonical origin for every absolute URL the site emits (metadataBase,
 * sitemap, OpenGraph images, JSON-LD @id values). Override per environment with
 * NEXT_PUBLIC_SITE_URL so preview deploys never advertise the production host.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://miracletouchcrystals.in"
).replace(/\/+$/, "");

export const SITE_NAME = "MT Crystals";
export const SITE_LEGAL_NAME = "Miracle Touch Crystals";
export const DEFAULT_OG_IMAGE = "/images/mtccover.png";

export const SITE_DESCRIPTION =
  "Shop handcrafted crystal bracelets at Miracle Touch Crystals. Authentic, energised gemstones for calm, love, protection and prosperity - handmade in India since 2017.";

export const DEFAULT_KEYWORDS = [
  "crystal bracelets",
  "healing crystals",
  "gemstone bracelets India",
  "chakra bracelets",
  "rose quartz bracelet",
  "amethyst bracelet",
  "tiger eye bracelet",
  "energised crystals",
  "Miracle Touch Crystals",
  "MT Crystals",
];

export function absoluteUrl(pathname = "/") {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  /** Cart, checkout, account and auth screens must never reach the index. */
  noIndex?: boolean;
  type?: "website" | "article";
};

/**
 * Single place where canonical URL, OpenGraph and Twitter tags are assembled so
 * every route ships a consistent, complete set instead of a bare title.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords,
  noIndex = false,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  // Only the brand cover is known to be 1200x630. Declaring those dimensions for
  // a product photo would make scrapers crop against the wrong aspect ratio.
  const ogImageEntry =
    image === DEFAULT_OG_IMAGE
      ? { url: ogImage, width: 1200, height: 630, alt: title }
      : { url: ogImage, alt: title };

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : DEFAULT_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImageEntry],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/** Trim marketing copy down to a description search engines will actually show. */
export function toMetaDescription(text: string, limit = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) {
    return clean;
  }

  const truncated = clean.slice(0, limit - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${(lastSpace > 60 ? truncated.slice(0, lastSpace) : truncated).trim()}…`;
}

/* ------------------------------------------------------------------ *
 * JSON-LD builders
 * ------------------------------------------------------------------ */

export function organizationSchema(settings?: SiteSettings | null) {
  const sameAs = settings ? getSocialLinks(settings).map((link) => link.url) : [];
  const addressLines = settings ? formatSettingsAddress(settings) : [];

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    alternateName: SITE_LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: settings?.footerAbout || SITE_DESCRIPTION,
    foundingDate: "2017",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery",
    areaServed: { "@type": "Country", name: "India" },
    ...(settings?.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings?.phonePrimary ? { telephone: settings.phonePrimary } : {}),
    ...(addressLines.length || settings?.city
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress:
              [settings?.addressLine1, settings?.addressLine2].filter(Boolean).join(", ") ||
              undefined,
            addressLocality: settings?.city || undefined,
            addressRegion: settings?.state || undefined,
            postalCode: settings?.pincode || undefined,
            addressCountry: settings?.country || "India",
          },
        }
      : {}),
    ...(settings?.contactEmail || settings?.phonePrimary
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              ...(settings?.phonePrimary ? { telephone: settings.phonePrimary } : {}),
              ...(settings?.contactEmail ? { email: settings.contactEmail } : {}),
              areaServed: "IN",
              availableLanguage: ["en", "hi"],
            },
          ],
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product, categoryNames: string[] = []) {
  const images = (product.images?.length ? product.images : [product.image])
    .filter(Boolean)
    .map((image) => absoluteUrl(image));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    description: product.description || product.shortDesc,
    image: images,
    sku: product.id,
    category: categoryNames[0] || product.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(product.bulletPoints?.length
      ? {
          additionalProperty: product.bulletPoints.map((point) => ({
            "@type": "PropertyValue",
            name: "Highlight",
            value: point,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };
}

export function itemListSchema(
  products: Product[],
  { name, path }: { name: string; path: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}

export function collectionPageSchema(category: Category, productCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Crystal Bracelets`,
    description: category.description || SITE_DESCRIPTION,
    url: absoluteUrl(`/category/${category.slug}`),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: productCount,
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
