import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Miracle Touch Crystals has been providing high-quality crystal bracelets since 2017, helping people find
              balance and positive energy.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-sm hover:underline">
              About Us
            </Link>
            <Link href="/products" className="text-sm hover:underline">
              Products
            </Link>
            <Link href="/benefits" className="text-sm hover:underline">
              Benefits
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">More</h3>
            <Link href="/gallery" className="text-sm hover:underline">
              Gallery
            </Link>
            <Link href="/testimonials" className="text-sm hover:underline">
              Testimonials
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
            <Link href="/faq" className="text-sm hover:underline">
              FAQ
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="text-sm">Email: info@mtcrystals.com</p>
            <p className="text-sm">Phone: (555) 123-4567</p>
            <div className="flex gap-4 mt-2">
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Miracle Touch Crystals. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
