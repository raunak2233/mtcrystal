"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Testimonial } from "@/lib/types";

const emptyForm = {
  id: "",
  name: "",
  location: "",
  rating: 5,
  message: "",
  product: "",
  image: "",
  reviewDate: "",
  featured: false,
  sortOrder: "0",
};

export function TestimonialManager({
  testimonials,
  onRefresh,
}: {
  testimonials: Testimonial[];
  onRefresh: () => Promise<void>;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setForm({ ...emptyForm, sortOrder: String(testimonials.length) });
    setFormOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setForm({
      id: testimonial.id,
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      message: testimonial.message,
      product: testimonial.product,
      image: testimonial.image,
      reviewDate: testimonial.reviewDate,
      featured: testimonial.featured,
      sortOrder: String(testimonial.sortOrder ?? 0),
    });
    setFormOpen(true);
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await apiUpload<{ imageUrls: string[] }>(
        "/api/uploads/product-image",
        formData
      );
      setForm((current) => ({ ...current, image: response.imageUrls[0] || current.image }));
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload photo");
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) || 0 };
      const isExisting = Boolean(form.id) && testimonials.some((item) => item.id === form.id);

      if (isExisting) {
        await apiSend(`/api/testimonials/${form.id}`, "PUT", payload);
        toast.success("Review updated");
      } else {
        await apiSend("/api/testimonials", "POST", payload);
        toast.success("Review added");
      }

      setFormOpen(false);
      setForm(emptyForm);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save review");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (testimonial: Testimonial) => {
    try {
      await apiSend(`/api/testimonials/${testimonial.id}`, "DELETE");
      toast.success("Review deleted");
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reviews"
        description="Shown on the testimonials page. Featured reviews also appear on the homepage."
        actionLabel="New Review"
        onAction={openCreate}
      />

      {testimonials.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-start gap-3">
                {testimonial.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.featured ? (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  {testimonial.location ? (
                    <p className="text-xs text-stone-500">{testimonial.location}</p>
                  ) : null}
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm italic text-stone-700">
                &ldquo;{testimonial.message}&rdquo;
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-stone-400">
                  {[testimonial.product, testimonial.reviewDate].filter(Boolean).join(" · ")}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(testimonial)}>
                    Edit
                  </Button>
                  <ConfirmDeleteButton
                    itemLabel="review"
                    itemName={`${testimonial.name}'s review`}
                    onConfirm={() => remove(testimonial)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reviews yet"
          description="Add customer reviews to build trust on the testimonials page."
          actionLabel="New Review"
          onAction={openCreate}
        />
      )}

      <FormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        title={form.id ? "Edit review" : "New review"}
        description="Everything here is visible to customers."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <SavingButton
              type="submit"
              form="testimonial-form"
              saving={saving}
              disabled={uploading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? "Saving..." : "Save Review"}
            </SavingButton>
          </>
        }
      >
        <form id="testimonial-form" onSubmit={save} className="space-y-5">
          <div>
            <Label htmlFor="testimonial-name">Customer name</Label>
            <Input
              id="testimonial-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="testimonial-location">Location</Label>
            <Input
              id="testimonial-location"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              placeholder="Delhi, India"
            />
          </div>

          <FieldGroup label="Rating">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, rating: value }))}
                  className="p-1"
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                >
                  <Star
                    className={`h-7 w-7 transition ${
                      value <= form.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </FieldGroup>

          <div>
            <Label htmlFor="testimonial-message">Review</Label>
            <Textarea
              id="testimonial-message"
              rows={5}
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="testimonial-product">Product purchased</Label>
            <Input
              id="testimonial-product"
              value={form.product}
              onChange={(event) =>
                setForm((current) => ({ ...current, product: event.target.value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="testimonial-date">Review date</Label>
            <Input
              id="testimonial-date"
              type="date"
              value={form.reviewDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, reviewDate: event.target.value }))
              }
            />
          </div>

          <FieldGroup label="Customer photo" hint="Optional — initials are shown when empty.">
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={uploadPhoto}
              disabled={uploading}
            />
            {uploading ? <p className="text-xs text-stone-500">Uploading...</p> : null}
            {form.image ? (
              <div className="flex items-center gap-3 pt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Customer"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => setForm((current) => ({ ...current, image: "" }))}
                >
                  Remove
                </Button>
              </div>
            ) : null}
          </FieldGroup>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="testimonial-featured" className="font-normal">
                Feature on homepage
              </Label>
              <p className="text-xs text-stone-500">Homepage shows up to three featured reviews.</p>
            </div>
            <Switch
              id="testimonial-featured"
              checked={form.featured}
              onCheckedChange={(checked) =>
                setForm((current) => ({ ...current, featured: checked }))
              }
            />
          </div>

          <div>
            <Label htmlFor="testimonial-sort">Display position</Label>
            <Input
              id="testimonial-sort"
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({ ...current, sortOrder: event.target.value }))
              }
            />
          </div>
        </form>
      </FormSheet>
    </div>
  );
}
