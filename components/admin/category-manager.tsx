"use client";

import { useMemo, useState } from "react";
import { CornerDownRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ConfirmDeleteButton,
  EmptyState,
  FormSheet,
  SavingButton,
  SectionHeader,
} from "@/components/admin/admin-ui";
import { apiSend } from "@/lib/api-client";
import { buildCategoryTree, getTopLevelCategories } from "@/lib/categories";
import type { Category } from "@/lib/types";

const NO_PARENT = "none";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  parentId: NO_PARENT,
  sortOrder: "0",
};

export function CategoryManager({
  categories,
  onRefresh,
}: {
  categories: Category[];
  onRefresh: () => Promise<void>;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const topLevel = useMemo(() => getTopLevelCategories(categories), [categories]);

  const openCreate = (parentId?: string) => {
    setForm({ ...emptyForm, parentId: parentId || NO_PARENT });
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId || NO_PARENT,
      sortOrder: String(category.sortOrder ?? 0),
    });
    setFormOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        parentId: form.parentId === NO_PARENT ? null : form.parentId,
        sortOrder: Number(form.sortOrder) || 0,
      };

      const isExisting = Boolean(form.id) && categories.some((item) => item.id === form.id);
      if (isExisting) {
        await apiSend(`/api/categories/${form.id}`, "PUT", payload);
        toast.success("Category updated");
      } else {
        await apiSend("/api/categories", "POST", payload);
        toast.success("Category created");
      }

      setFormOpen(false);
      setForm(emptyForm);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: Category) => {
    try {
      await apiSend(`/api/categories/${category.id}`, "DELETE");
      toast.success("Category deleted");
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Categories"
        description="Top-level groups become header dropdowns; their sub-categories fill the menu."
        actionLabel="New Category"
        onAction={() => openCreate()}
      />

      {tree.length ? (
        <div className="space-y-4">
          {tree.map((group) => (
            <div key={group.id} className="rounded-2xl border border-stone-200 bg-white">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="mt-0.5 break-all text-xs text-stone-500">
                    /category/{group.slug}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-stone-600">{group.description}</p>
                  <p className="mt-2 text-xs text-stone-400">
                    Position {group.sortOrder} · {group.children.length} sub-categor
                    {group.children.length === 1 ? "y" : "ies"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => openCreate(group.id)}>
                    Add sub-category
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(group)}>
                    Edit
                  </Button>
                  <ConfirmDeleteButton
                    itemLabel="category"
                    itemName={group.name}
                    onConfirm={() => remove(group)}
                    extraWarning={
                      group.children.length
                        ? "Its sub-categories must be removed or moved first."
                        : undefined
                    }
                  />
                </div>
              </div>

              {group.children.length ? (
                <div className="space-y-2 border-t border-stone-100 p-4">
                  {group.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex flex-col gap-3 rounded-xl bg-stone-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <CornerDownRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-400" />
                        <div className="min-w-0">
                          <p className="font-medium">{child.name}</p>
                          <p className="break-all text-xs text-stone-500">
                            /category/{child.slug} · position {child.sortOrder}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(child)}>
                          Edit
                        </Button>
                        <ConfirmDeleteButton
                          itemLabel="category"
                          itemName={child.name}
                          onConfirm={() => remove(child)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="border-t border-stone-100 p-4 text-sm text-stone-500">
                  No sub-categories yet — add one to give this group a dropdown menu.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No categories yet"
          description="Create a top-level group such as Chakras or Colours, then add sub-categories under it."
          actionLabel="New Category"
          onAction={() => openCreate()}
        />
      )}

      <FormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        title={form.id ? "Edit category" : "New category"}
        description="Give the category a name, a URL slug, and a place in the menu."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <SavingButton
              type="submit"
              form="category-form"
              saving={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? "Saving..." : "Save Category"}
            </SavingButton>
          </>
        }
      >
        <form id="category-form" onSubmit={save} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category-slug">URL slug</Label>
            <Input
              id="category-slug"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="root-chakra"
              required
            />
            <p className="mt-1 text-xs text-stone-500">
              Keep it short — this is the page address: /category/{form.slug || "your-slug"}
            </p>
          </div>

          <div>
            <Label>Parent category</Label>
            <Select
              value={form.parentId}
              onValueChange={(value) => setForm((current) => ({ ...current, parentId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Top-level group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT}>Top-level group (no parent)</SelectItem>
                {topLevel
                  .filter((category) => category.id !== form.id)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-stone-500">
              Choosing a parent turns this into a dropdown item under it.
            </p>
          </div>

          <div>
            <Label htmlFor="category-sort">Menu position</Label>
            <Input
              id="category-sort"
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({ ...current, sortOrder: event.target.value }))
              }
            />
            <p className="mt-1 text-xs text-stone-500">Lower numbers appear first.</p>
          </div>

          <div>
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Shown at the top of the category page."
              required
            />
          </div>
        </form>
      </FormSheet>
    </div>
  );
}
