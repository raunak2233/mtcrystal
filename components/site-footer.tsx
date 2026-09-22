import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { readCategories, readSettings } from "@/lib/server/store";
import { categoryHref, getTopLevelCategories } from "@/lib/categories";
import { formatSettingsAddress, getSocialLinks } from "@/lib/site-settings";
import { SERVICE_CITIES } from "@/lib/content";

const socialIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/benefits", label: "Crystal Benefits" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
];

const CARE_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/testimonials", label: "Customer Reviews" },
  { href: "/account", label: "My Account" },
  { href: "/cart", label: "Shopping Cart" },
];

export async function SiteFooter() {
  const [settings, categories] = await Promise.all([readSettings(), readCategories()]);
  const addressLines = formatSettingsAddress(settings);
  const socialLinks = getSocialLinks(settings);
  // Top-level groups only: the footer is for orientation, not the full tree.
  const topCategories = getTopLevelCategories(categories).slice(0, 8);

  return (
    <footer className="w-full border-t bg-gray-900 text-white">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-gray-300">
              {settings.footerAbout}
            </p>

            <div className="mt-2 space-y-2.5">
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-start gap-2.5 break-all text-sm text-gray-300 transition-colors hover:text-purple-400"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                  {settings.contactEmail}
                </a>
              ) : null}
              {settings.phonePrimary ? (
                <a
                  href={`tel:${settings.phonePrimary.replace(/\s+/g, "")}`}
                  className="flex items-start gap-2.5 text-sm text-gray-300 transition-colors hover:text-purple-400"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                  {settings.phonePrimary}
                </a>
              ) : null}
              {addressLines.length ? (
                <p className="flex items-start gap-2.5 text-sm text-gray-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                  <span>{addressLines.join(", ")}</span>
                </p>
              ) : null}
            </div>

            {socialLinks.length ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.key];
                  return (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-300 transition-colors hover:border-purple-500 hover:text-purple-400"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{link.label}</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <nav aria-label="Quick links" className="grid grid-cols-1 content-start gap-3">
            <h2 className="mb-1 text-base font-bold">Quick Links</h2>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 transition-colors hover:text-purple-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Customer care" className="grid grid-cols-1 content-start gap-3">
            <h2 className="mb-1 text-base font-bold">Customer Care</h2>
            {CARE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 transition-colors hover:text-purple-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {topCategories.length ? (
            <nav aria-label="Shop by category" className="grid grid-cols-1 content-start gap-3">
              <h2 className="mb-1 text-base font-bold">Shop By Intention</h2>
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={categoryHref(category.slug)}
                  className="text-sm text-gray-300 transition-colors hover:text-purple-400"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Crystal bracelet delivery across India
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            {SERVICE_CITIES.map((city) => city.name).join(" · ")} and every other serviceable PIN
            code in India.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MT Crystals - Miracle Touch Crystals. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">{settings.brandTagline}</p>
        </div>
      </div>
    </footer>
  );
}
