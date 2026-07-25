"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ExternalLink, ImagePlus, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ConfirmDeleteButton,
  EmptyState,
  FieldGroup,
  FormSheet,
  SavingButton,
  SectionHeader,
} from "@/components/admin/admin-ui";
import { apiSend, apiUpload } from "@/lib/api-client";
import { buildCategoryTree } from "@/lib/categories";
import type { Category, Product } from "@/lib/types";

const emptyForm = {
  id: "",
  slug: "",
  name: "",
  shortDesc: "",
  description: "",
  category: "",
  categories: [] as string[],
  price: "0",
  stock: "0",
  image: "",
  images: [] as string[],
  bulletPoints: "",
  featured: false,
  newArrival: false,
  bestSeller: false,
};

type ProductForm = typeof emptyForm;

export function ProductManager({
  products,
  categories,
  onRefresh,
}: {
  products: Product[];
  categories: Category[];
  onRefresh: () => Promise<void>;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const categoryNameBySlug = useMemo(
    () => new Map(categories.map((category) => [category.slug, category.name])),
    [categories]
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, search]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDesc: product.shortDesc,
      description: product.description,
      category: product.category,
      categories: product.categories || [],
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      images: product.images || [],
      bulletPoints: (product.bulletPoints || []).join("\n"),
      featured: Boolean(product.featured),
      newArrival: Boolean(product.newArrival),
      bestSeller: Boolean(product.bestSeller),
    });
    setFormOpen(true);
  };

  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const syncGallery = (images: string[], primary?: string) => {
    const deduped = Array.from(new Set(images.filter(Boolean)));
    setForm((current) => ({
      ...current,
      images: deduped,
      image:
        primary ||
        (current.image && deduped.includes(current.image) ? current.image : deduped[0] || ""),
    }));
  };

  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await apiUpload<{ imageUrls: string[] }>(
        "/api/uploads/product-image",
        formData
      );
      syncGallery([...form.images, ...response.imageUrls], form.image || response.imageUrls[0]);
      toast.success(
        response.imageUrls.length > 1
          ? `${response.imageUrls.length} images uploaded`
          : "Image uploaded"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload image");
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  };

  const toggleCategory = (slug: string) => {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(slug)
        ? current.categories.filter((item) => item !== slug)
        : [...current.categories, slug],
    }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.category) {
      toast.error("Pick a primary category");
      return;
    }
    if (!form.image) {
      toast.error("Upload at least one image");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        bulletPoints: form.bulletPoints
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        categories: Array.from(new Set([form.category, ...form.categories].filter(Boolean))),
      };

      const isExisting = Boolean(form.id) && products.some((product) => product.id === form.id);
      if (isExisting) {
        await apiSend(`/api/products/${form.id}`, "PUT", payload);
        toast.success("Product updated");
      } else {
        await apiSend("/api/products", "POST", payload);
        toast.success("Product created");
      }

      setFormOpen(false);
      setForm(emptyForm);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: Product) => {
    try {
      await apiSend(`/api/products/${product.id}`, "DELETE");
      toast.success("Product deleted");
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"} in the catalog`}
        actionLabel="New Product"
        onAction={openCreate}
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="pl-9"
          />
        </div>
      </SectionHeader>

      {visibleProducts.length ? (
        <div className="space-y-3">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-purple-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.bestSeller ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        <Star className="h-3 w-3" /> Best seller
                      </span>
                    ) : null}
                    {product.newArrival ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        New
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 line-clamp-1 text-sm text-stone-600">{product.shortDesc}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
                    <span className="font-medium text-stone-900">Rs. {product.price}</span>
                    <span className={product.stock > 0 ? "" : "text-red-600"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                    <span>{(product.images || []).length} image(s)</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(product.categories?.length ? product.categories : [product.category]).map(
                      (slug) => (
                        <span
                          key={slug}
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            slug === product.category
                              ? "bg-purple-100 text-purple-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {categoryNameBySlug.get(slug) || slug}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
                  <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                    Edit
                  </Button>
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Button variant="ghost" size="sm" className="w-full text-stone-600">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      View
                    </Button>
                  </Link>
                  <ConfirmDeleteButton
                    itemLabel="product"
                    itemName={product.name}
                    onConfirm={() => remove(product)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={search ? "No products match that search" : "No products yet"}
          description={
            search
              ? "Try a different name, slug or category."
              : "Add your first product to start filling the catalog."
          }
          actionLabel={search ? undefined : "New Product"}
          onAction={search ? undefined : openCreate}
        />
      )}

      <FormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        title={form.id ? "Edit product" : "New product"}
        description="Images, pricing and category placement for this product."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <SavingButton
              type="submit"
              form="product-form"
              saving={saving}
              disabled={uploading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? "Saving..." : "Save Product"}
            </SavingButton>
          </>
        }
      >
        <form id="product-form" onSubmit={save} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="product-slug">URL slug</Label>
              <Input
                id="product-slug"
                value={form.slug}
                onChange={(event) => setField("slug", event.target.value)}
                placeholder="amethyst-serenity"
                required
              />
              <p className="mt-1 text-xs text-stone-500">
                Appears in the address bar: /products/{form.slug || "your-slug"}
              </p>
            </div>
            <div>
              <Label htmlFor="product-short">Short description</Label>
              <Input
                id="product-short"
                value={form.shortDesc}
                onChange={(event) => setField("shortDesc", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="product-description">Full description</Label>
              <Textarea
                id="product-description"
                rows={4}
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="product-price">Price (Rs.)</Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => setField("price", event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => setField("stock", event.target.value)}
                required
              />
            </div>
          </div>

          <FieldGroup label="Images" hint="The first image, or the one you mark Primary, is used on cards.">
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={uploadImages}
              disabled={uploading}
            />
            {uploading ? <p className="text-xs text-stone-500">Uploading...</p> : null}

            {form.images.length ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {form.images.map((image) => (
                  <div key={image} className="overflow-hidden rounded-xl border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Product" className="h-24 w-full object-cover" />
                    <div className="flex gap-1 p-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={form.image === image ? "default" : "outline"}
                        className={`flex-1 text-xs ${
                          form.image === image ? "bg-purple-600 hover:bg-purple-700" : ""
                        }`}
                        onClick={() => syncGallery(form.images, image)}
                      >
                        {form.image === image ? "Primary" : "Set primary"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() =>
                          syncGallery(form.images.filter((item) => item !== image))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                <ImagePlus className="mx-auto mb-2 h-5 w-5" />
                No images yet
              </div>
            )}
          </FieldGroup>

          <FieldGroup label="Primary category">
            <Select value={form.category} onValueChange={(value) => setField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryTree.map((group) => (
                  <Fragment key={group.id}>
                    <SelectItem value={group.slug}>{group.name}</SelectItem>
                    {group.children.map((child) => (
                      <SelectItem key={child.id} value={child.slug}>
                        {group.name} › {child.name}
                      </SelectItem>
                    ))}
                  </Fragment>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup
            label="Also show in"
            hint="Tick every other category this product belongs to."
          >
            <div className="space-y-3">
              {categoryTree.map((group) => (
                <div key={group.id} className="rounded-xl border border-stone-200 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {group.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[group, ...group.children].map((category) => {
                      const isPrimary = form.category === category.slug;
                      const isSelected = isPrimary || form.categories.includes(category.slug);

                      return (
                        <button
                          key={category.id}
                          type="button"
                          disabled={isPrimary}
                          onClick={() => toggleCategory(category.slug)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition disabled:opacity-70 ${
                            isSelected
                              ? "border-purple-300 bg-purple-50 text-purple-700"
                              : "border-stone-200 bg-white text-stone-700 hover:border-purple-200"
                          }`}
                        >
                          {category.id === group.id ? `All ${category.name}` : category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FieldGroup>

          <div>
            <Label htmlFor="product-bullets">Benefits</Label>
            <Textarea
              id="product-bullets"
              rows={4}
              value={form.bulletPoints}
              onChange={(event) => setField("bulletPoints", event.target.value)}
              placeholder="One benefit per line"
            />
          </div>

          <FieldGroup label="Placement">
            <div className="space-y-3">
              {(
                [
                  ["featured", "Featured"],
                  ["newArrival", "Show in New Arrivals"],
                  ["bestSeller", "Show in Best Sellers"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`product-${key}`} className="font-normal">
                    {label}
                  </Label>
                  <Switch
                    id={`product-${key}`}
                    checked={form[key]}
                    onCheckedChange={(checked) => setField(key, checked)}
                  />
                </div>
              ))}
            </div>
          </FieldGroup>
        </form>
      </FormSheet>
    </div>
  );
}
