import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/logo";
import { readSettings } from "@/lib/server/store";
import { formatSettingsAddress, getSocialLinks } from "@/lib/site-settings";

const socialIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

export async function SiteFooter() {
  const settings = await readSettings();
  const addressLines = formatSettingsAddress(settings);
  const socialLinks = getSocialLinks(settings);

  return (
    <footer className="w-full border-t bg-gray-900 text-white">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed text-gray-300">{settings.footerAbout}</p>
          </div>

          <div className="grid grid-cols-1 content-start gap-3">
            <h3 className="mb-2 text-lg font-bold">Quick Links</h3>
            <Link href="/" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Home
            </Link>
            <Link href="/products" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Products
            </Link>
            <Link href="/benefits" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Benefits
            </Link>
            <Link href="/gallery" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Gallery
            </Link>
          </div>

          <div className="grid grid-cols-1 content-start gap-3">
            <h3 className="mb-2 text-lg font-bold">Customer Care</h3>
            <Link href="/contact" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Contact Us
            </Link>
            <Link href="/testimonials" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Testimonials
            </Link>
            <Link href="/account" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              My Account
            </Link>
            <Link href="/cart" className="text-sm text-gray-300 transition-colors hover:text-purple-400">
              Shopping Cart
            </Link>
          </div>

          <div className="grid grid-cols-1 content-start gap-3">
            <h3 className="mb-2 text-lg font-bold">Get in Touch</h3>
            {settings.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="break-all text-sm text-gray-300 transition-colors hover:text-purple-400"
              >
                Email: {settings.contactEmail}
              </a>
            ) : null}
            {settings.phonePrimary ? (
              <a
                href={`tel:${settings.phonePrimary.replace(/\s+/g, "")}`}
                className="text-sm text-gray-300 transition-colors hover:text-purple-400"
              >
                Phone: {settings.phonePrimary}
              </a>
            ) : null}
            {addressLines.map((line) => (
              <p key={line} className="text-sm text-gray-300">
                {line}
              </p>
            ))}

            {socialLinks.length ? (
              <div className="mt-4 flex flex-wrap gap-4">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.key];
                  return (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-gray-300 transition-colors hover:text-purple-400"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{link.label}</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MT Crystals - Miracle Touch Crystals. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-500">{settings.brandTagline}</p>
        </div>
      </div>
    </footer>
  );
}
