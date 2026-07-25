"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminNav, ADMIN_SECTIONS, type AdminSection } from "@/components/admin/admin-nav";
import { AdminSkeleton } from "@/components/admin/admin-skeleton";
import { BannerManager } from "@/components/admin/banner-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { OrderManager } from "@/components/admin/order-manager";
import { ProductManager } from "@/components/admin/product-manager";
import { SettingsManager } from "@/components/admin/settings-manager";
import { TestimonialManager } from "@/components/admin/testimonial-manager";
import {
  apiSend,
  getBanners,
  getCategories,
  getCurrentUser,
  getOrders,
  getProducts,
  getSettings,
  getTestimonials,
} from "@/lib/api-client";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";
import type {
  Banner,
  Category,
  Order,
  Product,
  SessionUser,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("orders");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const [orderFilter, setOrderFilter] = useState<"all" | Order["status"]>("all");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const loadData = useCallback(async () => {
    const [
      productResponse,
      categoryResponse,
      bannerResponse,
      orderResponse,
      testimonialResponse,
      settingsResponse,
    ] = await Promise.all([
      getProducts(),
      getCategories(),
      getBanners(),
      getOrders("visible"),
      getTestimonials(),
      getSettings(),
    ]);

    setProducts(productResponse.products);
    setCategories(categoryResponse.categories);
    setBanners(bannerResponse.banners);
    setOrders(orderResponse.orders);
    setTestimonials(testimonialResponse.testimonials);
    setSettings(settingsResponse.settings);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const current = await getCurrentUser();
        if (cancelled) return;

        setUser(current.user);
        if (current.user?.isAdmin) {
          await loadData();
        }
      } catch (error) {
        console.error("Failed to load admin data", error);
        toast.error("Unable to load the admin dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to refresh data");
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await apiSend(`/api/orders/${orderId}`, "PATCH", { status });
      toast.success("Order updated");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update order");
    }
  };

  if (loading) {
    return <AdminSkeleton />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4">
        <Card className="max-w-lg p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Admin Access Required</h1>
          <p className="text-stone-600">
            Sign in with an admin account to manage products, categories, orders and site content.
          </p>
          <Link href="/login?redirect=/admin">
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const currentSection = ADMIN_SECTIONS.find((section) => section.key === activeSection);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">MT Crystals</p>
            <h1 className="text-2xl font-bold">Admin</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Store
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="mb-5 lg:hidden">
          <AdminNav
            activeSection={activeSection}
            onSelect={setActiveSection}
            pendingOrders={pendingOrders}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[248px,minmax(0,1fr)]">
          <AdminNav
            activeSection={activeSection}
            onSelect={setActiveSection}
            pendingOrders={pendingOrders}
          />

          <section className="min-w-0 space-y-6">
            <div className="hidden items-center justify-between gap-3 lg:flex">
              <p className="text-sm text-stone-500">{currentSection?.description}</p>
              <div className="flex gap-2">
                <Link href="/" target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View store
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {activeSection === "orders" ? (
              <OrderManager
                orders={orders}
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
                selectedOrderId={selectedOrderId}
                setSelectedOrderId={setSelectedOrderId}
                updateOrderStatus={updateOrderStatus}
              />
            ) : null}

            {activeSection === "products" ? (
              <ProductManager products={products} categories={categories} onRefresh={refresh} />
            ) : null}

            {activeSection === "categories" ? (
              <CategoryManager categories={categories} onRefresh={refresh} />
            ) : null}

            {activeSection === "banners" ? (
              <BannerManager banners={banners} onRefresh={refresh} />
            ) : null}

            {activeSection === "testimonials" ? (
              <TestimonialManager testimonials={testimonials} onRefresh={refresh} />
            ) : null}

            {activeSection === "settings" ? (
              <SettingsManager settings={settings} onRefresh={refresh} />
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
