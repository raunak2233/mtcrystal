"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, ImagePlus, Trash2 } from "lucide-react";
import { AdminOrderManager } from "@/components/admin-order-manager";
import { AdminSidebar, type AdminSection } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiSend, apiUpload, getBanners, getCategories, getCurrentUser, getOrders, getProducts } from "@/lib/api-client";
import type { Banner, Category, Order, Product, SessionUser } from "@/lib/types";

const productTemplate = {
  id: "",
  slug: "",
  name: "",
  shortDesc: "",
  description: "",
  category: "",
  price: "0",
  stock: "0",
  image: "",
  images: "",
  bulletPoints: "",
  featured: false,
  newArrival: false,
  bestSeller: false,
};

const categoryTemplate = {
  id: "",
  name: "",
  slug: "",
  description: "",
};

const bannerTemplate = {
  id: "",
  title: "",
  subtitle: "",
  image: "",
  ctaText: "",
  ctaLink: "/products",
  secondaryCtaText: "",
  secondaryCtaLink: "",
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<"all" | Order["status"]>("all");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [productForm, setProductForm] = useState(productTemplate);
  const [categoryForm, setCategoryForm] = useState(categoryTemplate);
  const [bannerForm, setBannerForm] = useState(bannerTemplate);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    const current = await getCurrentUser();
    setUser(current.user);

    if (!current.user?.isAdmin) {
      setLoading(false);
      return;
    }

    const [productResponse, categoryResponse, bannerResponse, orderResponse] = await Promise.all([
      getProducts(),
      getCategories(),
      getBanners(),
      getOrders("visible"),
    ]);

    setProducts(productResponse.products);
    setCategories(categoryResponse.categories);
    setBanners(bannerResponse.banners);
    setOrders(orderResponse.orders);
    setSelectedOrderId((current) => current || orderResponse.orders[0]?.id || "");
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData().catch((error) => {
      console.error("Failed to load admin data", error);
      toast.error("Unable to load admin dashboard");
      setLoading(false);
    });
  }, []);

  const normalizeList = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const galleryImages = useMemo(
    () => normalizeList(productForm.images),
    [productForm.images]
  );

  const orderStats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
    }),
    [orders]
  );

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        images: normalizeList(productForm.images),
        bulletPoints: normalizeList(productForm.bulletPoints),
      };

      if (productForm.id && products.some((product) => product.id === productForm.id)) {
        await apiSend(`/api/products/${productForm.id}`, "PUT", payload);
        toast.success("Product updated");
      } else {
        await apiSend("/api/products", "POST", payload);
        toast.success("Product created");
      }

      setProductForm(productTemplate);
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const syncGallery = (images: string[], primaryImage?: string) => {
    const deduped = Array.from(new Set(images.filter(Boolean)));
    setProductForm((current) => ({
      ...current,
      image:
        primaryImage ||
        (current.image && deduped.includes(current.image)
          ? current.image
          : deduped[0] || ""),
      images: deduped.join("\n"),
    }));
  };

  const uploadProductImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await apiUpload<{ imageUrls: string[] }>("/api/uploads/product-image", formData);
      syncGallery(
        [...response.imageUrls, ...galleryImages],
        productForm.image || response.imageUrls[0]
      );

      toast.success(
        response.imageUrls.length > 1
          ? `${response.imageUrls.length} images uploaded`
          : "Image uploaded"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload image");
    } finally {
      event.target.value = "";
      setUploadingImage(false);
    }
  };

  const removeProductImage = (imageUrl: string) => {
    syncGallery(galleryImages.filter((image) => image !== imageUrl));
  };

  const makePrimaryImage = (imageUrl: string) => {
    syncGallery(galleryImages, imageUrl);
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (categoryForm.id && categories.some((category) => category.id === categoryForm.id)) {
        await apiSend(`/api/categories/${categoryForm.id}`, "PUT", categoryForm);
        toast.success("Category updated");
      } else {
        await apiSend("/api/categories", "POST", categoryForm);
        toast.success("Category created");
      }

      setCategoryForm(categoryTemplate);
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save category");
    } finally {
      setSaving(false);
    }
  };

  const saveBanner = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (bannerForm.id && banners.some((banner) => banner.id === bannerForm.id)) {
        await apiSend(`/api/banners/${bannerForm.id}`, "PUT", bannerForm);
        toast.success("Banner updated");
      } else {
        await apiSend("/api/banners", "POST", bannerForm);
        toast.success("Banner created");
      }

      setBannerForm(bannerTemplate);
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save banner");
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (url: string, label: string) => {
    try {
      await apiSend(url, "DELETE");
      toast.success(`${label} deleted`);
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Unable to delete ${label.toLowerCase()}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await apiSend(`/api/orders/${orderId}`, "PATCH", { status });
      toast.success("Order updated");
      await loadAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update order");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-lg p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold">Admin Access Required</h1>
          <p className="text-gray-600">Sign in with an admin account to manage products, banners, and orders.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px,1fr]">
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} orderStats={orderStats} />

        <section className="space-y-6">
          {activeSection === "products" ? (
            <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold">{productForm.id ? "Edit Product" : "New Product"}</h2>
              <form onSubmit={saveProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="product-id">Product ID</Label>
                    <Input id="product-id" value={productForm.id} onChange={(event) => setProductForm((current) => ({ ...current, id: event.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="product-slug">Slug</Label>
                    <Input id="product-slug" value={productForm.slug} onChange={(event) => setProductForm((current) => ({ ...current, slug: event.target.value }))} placeholder="amethyst-serenity" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="product-name">Name</Label>
                  <Input id="product-name" value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="product-short">Short Description</Label>
                  <Input id="product-short" value={productForm.shortDesc} onChange={(event) => setProductForm((current) => ({ ...current, shortDesc: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea id="product-description" value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={productForm.category} onValueChange={(value) => setProductForm((current) => ({ ...current, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product-price">Price</Label>
                    <Input id="product-price" type="number" value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} required />
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Available Categories</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setProductForm((current) => ({ ...current, category: category.slug }))}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          productForm.category === category.slug
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-stone-200 bg-white text-stone-700 hover:border-purple-200 hover:text-purple-700"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input id="product-stock" type="number" value={productForm.stock} onChange={(event) => setProductForm((current) => ({ ...current, stock: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="product-image">Primary Image</Label>
                  <Input id="product-image" value={productForm.image} onChange={(event) => setProductForm((current) => ({ ...current, image: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="product-image-upload">Upload Product Images</Label>
                  <Input
                    id="product-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    onChange={uploadProductImage}
                    disabled={uploadingImage}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {uploadingImage ? "Uploading to /public/bracelets..." : "Upload one or multiple images. They will be saved in the same bracelets folder used now."}
                  </p>
                </div>
                {galleryImages.length ? (
                  <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-stone-700">Product Gallery</p>
                      <span className="text-xs uppercase tracking-[0.2em] text-stone-400">{galleryImages.length} images</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {galleryImages.map((image) => (
                        <div key={image} className="overflow-hidden rounded-2xl border border-stone-200">
                          <img
                            src={image}
                            alt={productForm.name || "Product image"}
                            className="h-28 w-full object-cover"
                          />
                          <div className="space-y-2 p-3">
                            <p className="truncate text-xs text-stone-500">{image}</p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={productForm.image === image ? "default" : "outline"}
                                className={productForm.image === image ? "bg-purple-600 hover:bg-purple-700" : ""}
                                onClick={() => makePrimaryImage(image)}
                              >
                                Primary
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => removeProductImage(image)}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                    <ImagePlus className="mx-auto mb-3 h-6 w-6" />
                    Upload images to build the product gallery.
                  </div>
                )}
                <div>
                  <Label htmlFor="product-images">Gallery Images</Label>
                  <Textarea id="product-images" value={productForm.images} onChange={(event) => setProductForm((current) => ({ ...current, images: event.target.value }))} placeholder="One image path per line" />
                </div>
                <div>
                  <Label htmlFor="product-bullets">Benefits</Label>
                  <Textarea id="product-bullets" value={productForm.bulletPoints} onChange={(event) => setProductForm((current) => ({ ...current, bulletPoints: event.target.value }))} placeholder="One bullet point per line" />
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm((current) => ({ ...current, featured: event.target.checked }))} />
                    Featured
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={productForm.newArrival} onChange={(event) => setProductForm((current) => ({ ...current, newArrival: event.target.checked }))} />
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={productForm.bestSeller} onChange={(event) => setProductForm((current) => ({ ...current, bestSeller: event.target.checked }))} />
                    Best Seller
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={saving || uploadingImage}>
                    {saving ? "Saving..." : "Save Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setProductForm(productTemplate)}>
                    Clear
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <Link href={`/products/${product.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm text-purple-700">
                          Open page
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600">{product.shortDesc}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {product.category} | slug: {product.slug} | Rs. {product.price} | Stock {product.stock}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">{product.images.length} image(s)</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setProductForm({
                            id: product.id,
                            slug: product.slug,
                            name: product.name,
                            shortDesc: product.shortDesc,
                            description: product.description,
                            category: product.category,
                            price: String(product.price),
                            stock: String(product.stock),
                            image: product.image,
                            images: product.images.join("\n"),
                            bulletPoints: product.bulletPoints.join("\n"),
                            featured: Boolean(product.featured),
                            newArrival: Boolean(product.newArrival),
                            bestSeller: Boolean(product.bestSeller),
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button variant="outline" className="text-red-600" onClick={() => deleteResource(`/api/products/${product.id}`, "Product")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          ) : null}

          {activeSection === "categories" ? (
          <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold">{categoryForm.id ? "Edit Category" : "New Category"}</h2>
              <form onSubmit={saveCategory} className="space-y-4">
                <div>
                  <Label htmlFor="category-id">Category ID</Label>
                  <Input id="category-id" value={categoryForm.id} onChange={(event) => setCategoryForm((current) => ({ ...current, id: event.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="category-name">Name</Label>
                  <Input id="category-name" value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="category-slug">Slug</Label>
                  <Input id="category-slug" value={categoryForm.slug} onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea id="category-description" value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} required />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={saving}>
                    {saving ? "Saving..." : "Save Category"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCategoryForm(categoryTemplate)}>
                    Clear
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                      <p className="mt-2 text-sm text-gray-600">{category.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setCategoryForm(category)}>
                        Edit
                      </Button>
                      <Button variant="outline" className="text-red-600" onClick={() => deleteResource(`/api/categories/${category.id}`, "Category")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          ) : null}

          {activeSection === "banners" ? (
          <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold">{bannerForm.id ? "Edit Banner" : "New Banner"}</h2>
              <form onSubmit={saveBanner} className="space-y-4">
                <div>
                  <Label htmlFor="banner-id">Banner ID</Label>
                  <Input id="banner-id" value={bannerForm.id} onChange={(event) => setBannerForm((current) => ({ ...current, id: event.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="banner-title">Title</Label>
                  <Input id="banner-title" value={bannerForm.title} onChange={(event) => setBannerForm((current) => ({ ...current, title: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="banner-subtitle">Subtitle</Label>
                  <Textarea id="banner-subtitle" value={bannerForm.subtitle} onChange={(event) => setBannerForm((current) => ({ ...current, subtitle: event.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="banner-image">Image</Label>
                  <Input id="banner-image" value={bannerForm.image} onChange={(event) => setBannerForm((current) => ({ ...current, image: event.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="banner-cta-text">Primary CTA Text</Label>
                    <Input id="banner-cta-text" value={bannerForm.ctaText} onChange={(event) => setBannerForm((current) => ({ ...current, ctaText: event.target.value }))} required />
                  </div>
                  <div>
                    <Label htmlFor="banner-cta-link">Primary CTA Link</Label>
                    <Input id="banner-cta-link" value={bannerForm.ctaLink} onChange={(event) => setBannerForm((current) => ({ ...current, ctaLink: event.target.value }))} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="banner-secondary-text">Secondary CTA Text</Label>
                    <Input id="banner-secondary-text" value={bannerForm.secondaryCtaText} onChange={(event) => setBannerForm((current) => ({ ...current, secondaryCtaText: event.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="banner-secondary-link">Secondary CTA Link</Label>
                    <Input id="banner-secondary-link" value={bannerForm.secondaryCtaLink} onChange={(event) => setBannerForm((current) => ({ ...current, secondaryCtaLink: event.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={saving}>
                    {saving ? "Saving..." : "Save Banner"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setBannerForm(bannerTemplate)}>
                    Clear
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              {banners.map((banner) => (
                <Card key={banner.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{banner.title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{banner.subtitle}</p>
                      <p className="mt-2 text-sm text-gray-500">{banner.ctaText} {"->"} {banner.ctaLink}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setBannerForm({ ...banner, secondaryCtaText: banner.secondaryCtaText || "", secondaryCtaLink: banner.secondaryCtaLink || "" })}>
                        Edit
                      </Button>
                      <Button variant="outline" className="text-red-600" onClick={() => deleteResource(`/api/banners/${banner.id}`, "Banner")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          ) : null}

          {activeSection === "orders" ? (
            <AdminOrderManager
              orders={orders}
              orderFilter={orderFilter}
              setOrderFilter={setOrderFilter}
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
              updateOrderStatus={updateOrderStatus}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
