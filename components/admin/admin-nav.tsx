"use client";

import {
  Boxes,
  GalleryVerticalEnd,
  LayoutTemplate,
  MessageSquareQuote,
  Settings,
  ShoppingBag,
} from "lucide-react";

export type AdminSection =
  | "orders"
  | "products"
  | "categories"
  | "banners"
  | "testimonials"
  | "settings";

export const ADMIN_SECTIONS: {
  key: AdminSection;
  label: string;
  description: string;
  icon: typeof ShoppingBag;
}[] = [
  { key: "orders", label: "Orders", description: "Track and fulfil orders", icon: ShoppingBag },
  { key: "products", label: "Products", description: "Catalog and stock", icon: Boxes },
  { key: "categories", label: "Categories", description: "Menu structure", icon: GalleryVerticalEnd },
  { key: "banners", label: "Banners", description: "Homepage hero", icon: LayoutTemplate },
  { key: "testimonials", label: "Reviews", description: "Customer testimonials", icon: MessageSquareQuote },
  { key: "settings", label: "Settings", description: "Contact and social links", icon: Settings },
];

export function AdminNav({
  activeSection,
  onSelect,
  pendingOrders,
}: {
  activeSection: AdminSection;
  onSelect: (section: AdminSection) => void;
  pendingOrders: number;
}) {
  return (
    <>
      {/* Phones and tablets: a scrollable pill row pinned under the page title. */}
      <div className="-mx-4 px-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => onSelect(section.key)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-stone-200 bg-white text-stone-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
                {section.key === "orders" && pendingOrders > 0 ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      isActive ? "bg-white/20" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {pendingOrders}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: persistent sidebar. */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-2 rounded-3xl bg-slate-950 p-4 text-white shadow-xl">
          <div className="px-2 pb-3 pt-2">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">MT Crystals</p>
            <h1 className="mt-2 text-2xl font-bold">Admin</h1>
          </div>

          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => onSelect(section.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                  isActive
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{section.label}</span>
                  <span
                    className={`block truncate text-xs ${
                      isActive ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {section.description}
                  </span>
                </span>
                {section.key === "orders" && pendingOrders > 0 ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive ? "bg-purple-100 text-purple-700" : "bg-purple-600 text-white"
                    }`}
                  >
                    {pendingOrders}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
