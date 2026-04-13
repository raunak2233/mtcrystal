import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-gray-900 text-white">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Miracle Touch Crystals has been providing high-quality crystal
              bracelets since 2017, helping people find balance and positive
              energy.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/benefits"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="/gallery"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Gallery
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <h3 className="text-lg font-bold mb-2">Customer Care</h3>
            <Link
              href="/contact"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/testimonials"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/account"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/cart"
              className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
            >
              Shopping Cart
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <h3 className="text-lg font-bold mb-2">Get in Touch</h3>
            <p className="text-sm text-gray-300">
              Email: help@miracletouchcrystals.in
            </p>
            <p className="text-sm text-gray-300">Phone: +91 84484 72076</p>
            <p className="text-sm text-gray-300">Delhi, India</p>
            <div className="flex gap-4 mt-4">
              <Link
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MT Crystals - Miracle Touch Crystals.
            All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Handcrafted with love since 2017
          </p>
        </div>
      </div>
    </footer>
  );
}
