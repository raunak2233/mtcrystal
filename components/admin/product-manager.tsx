"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  ExternalLink,
  FileText,
  ImagePlus,
  IndianRupee,
  LayoutGrid,
  Loader2,
  Search,
  Sparkles,
  Star,
  Tags,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ConfirmDeleteButton,
  EmptyState,
  FormModal,
  FormSection,
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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");
}

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
  // New products take their link from the name until the admin edits it.
  const [slugTouched, setSlugTouched] = useState(false);

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

  const isEditing = Boolean(form.id) && products.some((product) => product.id === form.id);
  const selectedCategories = Array.from(
    new Set([form.category, ...form.categories].filter(Boolean))
  );
  const bulletCount = form.bulletPoints.split("\n").filter((line) => line.trim()).length;
  const categoryLabel = (slug: string) => {
    const category = categories.find((item) => item.slug === slug);
    const parent = category?.parentId
      ? categories.find((item) => item.id === category.parentId)
      : undefined;
    return parent ? `${parent.name} › ${category?.name}` : category?.name || slug;
  };

  const openCreate = () => {
    setForm(emptyForm);
    setSlugTouched(false);
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
    setSlugTouched(true);
    setFormOpen(true);
  };

  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setName = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : toSlug(name).replace(/-+$/, ""),
    }));
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

  // `category` is the main one and is always part of the selection; removing it
  // promotes the next selected category, and the first pick becomes main.
  const toggleCategory = (slug: string) => {
    setForm((current) => {
      const selected = Array.from(
        new Set([current.category, ...current.categories].filter(Boolean))
      );
      const next = selected.includes(slug)
        ? selected.filter((item) => item !== slug)
        : [...selected, slug];
      return {
        ...current,
        categories: next,
        category: next.includes(current.category) ? current.category : next[0] || "",
      };
    });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.category) {
      toast.error("Pick at least one category");
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
        slug: form.slug.replace(/-+$/, ""),
        price: Number(form.price),
        stock: Number(form.stock),
        bulletPoints: form.bulletPoints
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        categories: Array.from(new Set([form.category, ...form.categories].filter(Boolean))),
      };

      if (isEditing) {
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

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={isEditing ? `Edit ${form.name || "product"}` : "Add a new product"}
        description="Fill in the details, add photos, choose categories, then save."
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              className="hidden text-stone-600 sm:inline-flex"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <SavingButton
              type="submit"
              form="product-form"
              saving={saving}
              disabled={uploading}
              className="rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 text-white shadow-md hover:from-purple-700 hover:to-fuchsia-700"
            >
              {saving ? "Saving..." : isEditing ? "Save changes" : "Publish product"}
            </SavingButton>
          </>
        }
      >
        <form
          id="product-form"
          onSubmit={save}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"
        >
          <div className="space-y-6">
            <FormSection
              icon={FileText}
              tone="purple"
              title="Basic details"
              hint="What customers see first on the product card and page."
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-name" className="text-stone-700">
                    Product name
                  </Label>
                  <Input
                    id="product-name"
                    value={form.name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Amethyst Crystal Bracelet"
                    className="mt-1.5 h-11 text-base"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="product-slug" className="text-stone-700">
                    Page link
                  </Label>
                  <div className="mt-1.5 flex items-center overflow-hidden rounded-md border border-input bg-stone-50 focus-within:ring-2 focus-within:ring-purple-300">
                    <span className="whitespace-nowrap border-r border-stone-200 px-3 text-sm text-stone-500">
                      /products/
                    </span>
                    <input
                      id="product-slug"
                      value={form.slug}
                      onChange={(event) => {
                        setSlugTouched(true);
                        setField("slug", toSlug(event.target.value));
                      }}
                      placeholder="amethyst-crystal-bracelet"
                      className="h-10 w-full bg-white px-3 text-sm outline-none"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    Filled in from the name. Change it only if you need a different link.
                  </p>
                </div>
                <div>
                  <Label htmlFor="product-short" className="text-stone-700">
                    Subtitle
                  </Label>
                  <Input
                    id="product-short"
                    value={form.shortDesc}
                    onChange={(event) => setField("shortDesc", event.target.value)}
                    placeholder="e.g. Natural gemstone beads for peace and intuition"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="product-description" className="text-stone-700">
                    Full description
                  </Label>
                  <Textarea
                    id="product-description"
                    rows={6}
                    value={form.description}
                    onChange={(event) => setField("description", event.target.value)}
                    placeholder="Tell the story of the stone, how it feels to wear, and who it is for."
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              icon={Sparkles}
              tone="pink"
              title="Why people love it"
              hint="One benefit per line. Each line becomes a bullet point."
              aside={
                bulletCount ? (
                  <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700">
                    {bulletCount} {bulletCount === 1 ? "point" : "points"}
                  </span>
                ) : null
              }
            >
              <Textarea
                id="product-bullets"
                rows={5}
                value={form.bulletPoints}
                onChange={(event) => setField("bulletPoints", event.target.value)}
                placeholder={"Natural amethyst beads\nCalming everyday energy\nStretch fit for most wrists"}
              />
            </FormSection>

            <FormSection
              icon={Tags}
              tone="fuchsia"
              title="Categories"
              hint="Pick every category this product belongs to. The starred one is the main category."
            >
              {selectedCategories.length ? (
                <div className="mb-5 rounded-2xl border border-purple-100 bg-purple-50/60 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
                    Selected ({selectedCategories.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((slug) => {
                      const isPrimary = form.category === slug;
                      return (
                        <span
                          key={slug}
                          className={`inline-flex items-center gap-1 rounded-full border py-1 pl-1.5 pr-1 text-sm ${
                            isPrimary
                              ? "border-amber-300 bg-amber-50 text-amber-800"
                              : "border-purple-200 bg-white text-purple-800"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setField("category", slug)}
                            title={isPrimary ? "Main category" : "Make this the main category"}
                            className="rounded-full p-0.5 transition hover:bg-amber-100"
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                isPrimary ? "fill-amber-400 text-amber-500" : "text-stone-300"
                              }`}
                            />
                          </button>
                          {categoryLabel(slug)}
                          <button
                            type="button"
                            onClick={() => toggleCategory(slug)}
                            aria-label={`Remove ${categoryLabel(slug)}`}
                            className="rounded-full p-0.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="mb-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-500">
                  Nothing selected yet. The first category you pick becomes the main one.
                </p>
              )}

              <Tabs defaultValue={categoryTree[0]?.id}>
                <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-stone-100 p-1">
                  {categoryTree.map((group) => {
                    const count = [group, ...group.children].filter((category) =>
                      selectedCategories.includes(category.slug)
                    ).length;
                    return (
                      <TabsTrigger
                        key={group.id}
                        value={group.id}
                        className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-purple-700"
                      >
                        {group.name}
                        {count ? (
                          <span className="rounded-full bg-purple-600 px-1.5 text-[10px] font-semibold leading-4 text-white">
                            {count}
                          </span>
                        ) : null}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {categoryTree.map((group) => (
                  <TabsContent key={group.id} value={group.id} className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {(group.children.length ? group.children : [group]).map((category) => {
                        const selected = selectedCategories.includes(category.slug);
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => toggleCategory(category.slug)}
                            aria-pressed={selected}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                              selected
                                ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                                : "border-stone-200 bg-white text-stone-700 hover:border-purple-300 hover:bg-purple-50"
                            }`}
                          >
                            {selected ? <Check className="h-3.5 w-3.5" /> : null}
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </FormSection>
          </div>

          <div className="space-y-6 lg:sticky lg:top-0">
            <FormSection
              icon={ImagePlus}
              tone="sky"
              title="Photos"
              hint="The starred photo is shown on product cards."
            >
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
                  uploading
                    ? "border-sky-300 bg-sky-50"
                    : "border-sky-200 bg-sky-50/50 hover:border-sky-400 hover:bg-sky-50"
                }`}
              >
                {uploading ? (
                  <Loader2 className="mb-2 h-6 w-6 animate-spin text-sky-600" />
                ) : (
                  <Upload className="mb-2 h-6 w-6 text-sky-600" />
                )}
                <span className="text-sm font-medium text-sky-800">
                  {uploading ? "Uploading..." : "Click to upload photos"}
                </span>
                <span className="mt-0.5 text-xs text-sky-700/70">
                  JPG, PNG, WEBP or GIF, up to 5 MB each
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  onChange={uploadImages}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>

              {form.images.length ? (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {form.images.map((image) => {
                    const isPrimary = form.image === image;
                    return (
                      <div
                        key={image}
                        className={`relative aspect-square overflow-hidden rounded-xl border-2 ${
                          isPrimary ? "border-amber-400" : "border-transparent"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => syncGallery(form.images, image)}
                          title={isPrimary ? "Main photo" : "Make main photo"}
                          className="absolute left-1 top-1 rounded-full bg-white/90 p-1 shadow-sm"
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${
                              isPrimary ? "fill-amber-400 text-amber-500" : "text-stone-400"
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => syncGallery(form.images.filter((item) => item !== image))}
                          aria-label="Remove photo"
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-stone-500 shadow-sm transition hover:text-red-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </FormSection>

            <FormSection icon={IndianRupee} tone="emerald" title="Price & stock">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="product-price" className="text-stone-700">
                    Price
                  </Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                      ₹
                    </span>
                    <Input
                      id="product-price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => setField("price", event.target.value)}
                      className="pl-7 text-base font-semibold"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="product-stock" className="text-stone-700">
                    In stock
                  </Label>
                  <Input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => setField("stock", event.target.value)}
                    className="mt-1.5 text-base"
                    required
                  />
                </div>
              </div>
              {Number(form.stock) === 0 ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  Stock is 0, so this product will show as out of stock.
                </p>
              ) : null}
            </FormSection>

            <FormSection
              icon={LayoutGrid}
              tone="amber"
              title="Home page placement"
              hint="Choose where this product is highlighted."
            >
              <div className="space-y-2">
                {(
                  [
                    ["featured", "Featured", "Shown in the featured section"],
                    ["newArrival", "New arrival", "Shown under New Arrivals"],
                    ["bestSeller", "Best seller", "Shown under Best Sellers"],
                  ] as const
                ).map(([key, label, help]) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 transition ${
                      form[key] ? "border-amber-200 bg-amber-50/70" : "border-stone-200"
                    }`}
                  >
                    <Label htmlFor={`product-${key}`} className="cursor-pointer font-normal">
                      <span className="block text-sm font-medium text-stone-800">{label}</span>
                      <span className="block text-xs text-stone-500">{help}</span>
                    </Label>
                    <Switch
                      id={`product-${key}`}
                      checked={form[key]}
                      onCheckedChange={(checked) => setField(key, checked)}
                    />
                  </div>
                ))}
              </div>
            </FormSection>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
