"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ConfirmDeleteButton,
  EmptyState,
  FieldGroup,
  FormSheet,
  SavingButton,
  SectionHeader,
} from "@/components/admin/admin-ui";
import { apiSend, apiUpload } from "@/lib/api-client";
import type { Banner } from "@/lib/types";

const emptyForm = { id: "", image: "" };

export function BannerManager({
  banners,
  onRefresh,
}: {
  banners: Banner[];
  onRefresh: () => Promise<void>;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setForm({ id: banner.id, image: banner.image });
    setFormOpen(true);
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.success("Banner image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload image");
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.image) {
      toast.error("Upload a banner image first");
      return;
    }

    setSaving(true);
    try {
      const isExisting = Boolean(form.id) && banners.some((banner) => banner.id === form.id);
      if (isExisting) {
        await apiSend(`/api/banners/${form.id}`, "PUT", form);
        toast.success("Banner updated");
      } else {
        await apiSend("/api/banners", "POST", form);
        toast.success("Banner created");
      }

      setFormOpen(false);
      setForm(emptyForm);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save banner");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (banner: Banner) => {
    try {
      await apiSend(`/api/banners/${banner.id}`, "DELETE");
      toast.success("Banner deleted");
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Banners"
        description="Full-width images rotating at the top of the homepage."
        actionLabel="New Banner"
        onAction={openCreate}
      />

      {banners.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner.image} alt={banner.id} className="h-40 w-full object-cover" />
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 break-all text-xs text-stone-500">{banner.image}</p>
                <div className="flex flex-shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(banner)}>
                    Edit
                  </Button>
                  <ConfirmDeleteButton
                    itemLabel="banner"
                    itemName={banner.id}
                    onConfirm={() => remove(banner)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No banners yet"
          description="Upload a wide image to show at the top of the homepage."
          actionLabel="New Banner"
          onAction={openCreate}
        />
      )}

      <FormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        title={form.id ? "Edit banner" : "New banner"}
        description="Wide images work best — around 1920x800 pixels."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <SavingButton
              type="submit"
              form="banner-form"
              saving={saving}
              disabled={uploading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? "Saving..." : "Save Banner"}
            </SavingButton>
          </>
        }
      >
        <form id="banner-form" onSubmit={save} className="space-y-5">
          <FieldGroup label="Banner image">
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={uploadImage}
              disabled={uploading}
            />
            {uploading ? <p className="text-xs text-stone-500">Uploading...</p> : null}

            {form.image ? (
              <div className="overflow-hidden rounded-xl border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="Banner preview" className="h-40 w-full object-cover" />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                <ImagePlus className="mx-auto mb-2 h-5 w-5" />
                No image chosen
              </div>
            )}
          </FieldGroup>

          <div>
            <Label htmlFor="banner-image-url">Image URL</Label>
            <Input
              id="banner-image-url"
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
              placeholder="Uploads fill this in automatically"
              required
            />
          </div>
        </form>
      </FormSheet>
    </div>
  );
}
