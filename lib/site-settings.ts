import type { SiteSettings } from "@/lib/types";

/**
 * Fallback used before an admin saves anything, and as the shape the settings
 * form binds to. Values mirror what used to be hardcoded in the footer and the
 * contact page.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandTagline: "Handcrafted with love since 2017",
  footerAbout:
    "Miracle Touch Crystals has been providing high-quality crystal bracelets since 2017, helping people find balance and positive energy.",
  contactEmail: "help@miracletouchcrystals.in",
  supportEmail: "",
  phonePrimary: "+91 84484 72076",
  phoneSecondary: "",
  addressLine1: "",
  addressLine2: "",
  city: "Delhi",
  state: "",
  pincode: "",
  country: "India",
  businessHours:
    "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  whatsappUrl: "",
};

/** Address lines joined for display, skipping the parts that are not filled in. */
export function formatSettingsAddress(settings: SiteSettings) {
  const cityLine = [settings.city, settings.state].filter(Boolean).join(", ");
  const regionLine = [cityLine, settings.pincode].filter(Boolean).join(" ");

  return [settings.addressLine1, settings.addressLine2, regionLine, settings.country]
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getSocialLinks(settings: SiteSettings) {
  return [
    { key: "facebook", label: "Facebook", url: settings.facebookUrl },
    { key: "instagram", label: "Instagram", url: settings.instagramUrl },
    { key: "twitter", label: "Twitter", url: settings.twitterUrl },
    { key: "youtube", label: "YouTube", url: settings.youtubeUrl },
    { key: "whatsapp", label: "WhatsApp", url: settings.whatsappUrl },
  ].filter((link) => link.url.trim().length > 0);
}
