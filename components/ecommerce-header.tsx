"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { CategoryNavBar, CategoryNavMobile } from "@/components/category-nav";
import { getCartCount } from "@/lib/cart";
import { getCurrentUser } from "@/lib/api-client";
import type { Category, SessionUser } from "@/lib/types";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/benefits", label: "Benefits" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function EcommerceHeader({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setCartCount(getCartCount());

    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    const loadUser = () => {
      getCurrentUser()
        .then((response) => setUser(response.user))
        .catch((error) => console.error("Failed to load header user", error));
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("authChanged", loadUser);
    loadUser();

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-stone-200 bg-stone-50 hover:bg-stone-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] border-r border-stone-200 bg-[#fbf7f1] px-0">
                <SheetHeader className="border-b border-stone-200 px-6 pb-5 text-left">
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Explore MT Crystals
                  </SheetTitle>
                  <SheetDescription>
                    Browse collections, stories, and your account from one place.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
                  <div className="space-y-2">
                    {primaryLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-purple-200 hover:text-purple-700"
                        >
                          <span>{link.label}</span>
                          <span className="text-stone-300">/</span>
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link
                        href={user ? "/account" : "/login"}
                        className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-purple-200 hover:text-purple-700"
                      >
                        <span>{user ? "My Account" : "Login / Signup"}</span>
                        <span className="text-stone-300">/</span>
                      </Link>
                    </SheetClose>
                    {user?.isAdmin ? (
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="flex items-center justify-between rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                        >
                          <span>Admin Dashboard</span>
                          <ShieldCheck className="h-4 w-4" />
                        </Link>
                      </SheetClose>
                    ) : null}
                  </div>

                  <div className="mt-8">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Shop By Category
                    </p>
                    <CategoryNavMobile categories={categories} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden max-w-2xl flex-1 md:flex">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for crystals, bracelets..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 rounded-full border-stone-200 bg-stone-50 pr-10"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-9 w-9 rounded-full"
              >
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link href={user ? "/account" : "/login"} className="hidden sm:block">
              <Button variant="ghost" className="gap-2 px-3">
                <User className="h-5 w-5" />
                <span className="max-w-28 truncate text-sm">
                  {user ? user.name.split(" ")[0] : "Account"}
                </span>
              </Button>
            </Link>

            {user?.isAdmin ? (
              <Link href="/admin" className="hidden lg:block">
                <Button variant="ghost" className="gap-2 px-3 text-purple-700">
                  <ShieldCheck className="h-5 w-5" />
                  Admin
                </Button>
              </Link>
            ) : null}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 ? (
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-purple-600 p-0 text-xs">
                    {cartCount}
                  </Badge>
                ) : null}
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="pb-4 md:hidden">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search crystals..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full border-stone-200 bg-stone-50 pr-10"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1 h-8 w-8 rounded-full"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </form>
      </div>

      <div className="hidden border-t border-stone-200 bg-purple-50/50 md:block">
        <div className="container mx-auto px-4">
          <CategoryNavBar categories={categories} />
        </div>
      </div>
    </header>
  );
}
