"use client";

import { Boxes, GalleryVerticalEnd, LayoutTemplate, ShoppingBag } from "lucide-react";
import type { Order } from "@/lib/types";

export type AdminSection = "orders" | "products" | "categories" | "banners";

const sectionMeta: Record<AdminSection, { label: string; icon: typeof ShoppingBag; description: string }> = {
  orders: {
    label: "Orders",
    icon: ShoppingBag,
    description: "Track and update customer orders",
  },
  products: {
    label: "Products",
    icon: Boxes,
    description: "Manage products and stock",
  },
  categories: {
    label: "Categories",
    icon: GalleryVerticalEnd,
    description: "Control catalog navigation",
  },
  banners: {
    label: "Banners",
    icon: LayoutTemplate,
    description: "Refresh hero content",
  },
};

export function AdminSidebar({
  activeSection,
  setActiveSection,
  orderStats,
}: {
  activeSection: AdminSection;
  setActiveSection: (value: AdminSection) => void;
  orderStats: { total: number; pending: number; revenue: number };
}) {
  return (
    <aside className="rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">MT Crystals</p>
        <h1 className="mt-3 text-3xl font-bold">Admin</h1>
        <p className="mt-2 text-sm text-slate-300">Dedicated control room for catalog, banners, and fulfillment.</p>
      </div>

      <div className="mb-8 space-y-3">
        {(Object.keys(sectionMeta) as AdminSection[]).map((section) => {
          const meta = sectionMeta[section];
          const Icon = meta.icon;
          const isActive = activeSection === section;

          return (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                isActive ? "bg-white text-slate-950 shadow-lg" : "bg-slate-900/60 text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              <div>
                <p className="font-medium">{meta.label}</p>
                <p className={`text-xs ${isActive ? "text-slate-500" : "text-slate-400"}`}>{meta.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 rounded-2xl bg-white/10 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Orders</span>
          <span className="font-semibold">{orderStats.total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Pending</span>
          <span className="font-semibold">{orderStats.pending}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Revenue</span>
          <span className="font-semibold">Rs. {orderStats.revenue}</span>
        </div>
      </div>
    </aside>
  );
}
