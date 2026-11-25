"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EmptyState,
  FormSheet,
  SavingButton,
  SectionHeader,
} from "@/components/admin/admin-ui";
import { apiSend } from "@/lib/api-client";
import type { Page } from "@/lib/types";

const emptyForm = { id: "", title: "", description: "", body: "" };

/** One row per page — About, Benefits, Gallery and so on — edited here, in plain text. */
export function PageManager({
  pages,
  onRefresh,
}: {
  pages: Page[];
  onRefresh: () => Promise<void>;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => setForm({ ...emptyForm });

  const openEdit = (page: Page) => {
    setForm({
      id: page.id,
      title: page.title,
      description: page.description,
      body: page.body,
    });
    setFormOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.id.trim()) {
      toast.error("Give the page an id like 'about' or 'benefits'");
      return;
    }

    setSaving(true);
    try {
      await apiSend(`/api/pages/${form.id}`, "PUT", {
        title: form.title,
        description: form.description,
        body: form.body,
      });
      const isExisting = pages.some((page) => page.id === form.id);
      toast.success(isExisting ? "Page updated" : "Page created");
      setFormOpen(false);
      setForm(emptyForm);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pages"
        description="Edit each page's text — one page at a time. Enter plain text, no HTML."
        actionLabel="New Page"
        onAction={openCreate}
      />

      {pages.length ? (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">{page.title || page.id}</h3>
                  <p className="mt-0.5 break-all text-xs text-stone-500">/page/{page.id}</p>
                  {page.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-stone-500">
                      {page.description}
                    </p>
                  ) : null}
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(page)}>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pages yet"
          description="Pages like About, Benefits and Gallery live here — add one to start editing it."
          actionLabel="New Page"
          onAction={openCreate}
        />
      )}

      <FormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        title={form.id ? `Edit page ${form.id}` : "New page"}
        description="Enter text only — no HTML needed; paragraphs appear as written."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <SavingButton
              type="submit"
              form="page-form"
              saving={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? "Saving..." : "Save Page"}
            </SavingButton>
          </>
        }
      >
        <form id="page-form" onSubmit={save} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="page-id">Page id</Label>
            <Input
              id="page-id"
              value={form.id}
              onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
              placeholder="about"
              required
            />
            <p className="text-xs text-stone-500">
              Short id used in the page link: /page/{form.id || "your-id"}.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-title">Page title</Label>
            <Input
              id="page-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-description">Short description (optional)</Label>
            <Textarea
              id="page-description"
              rows={2}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="One line shown under the title."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-body">Page text</Label>
            <Textarea
              id="page-body"
              rows={12}
              value={form.body}
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
              placeholder="The main text of the page. Write it as you want it to read."
            />
            <p className="text-xs text-stone-500">Plain text — blank lines separate paragraphs.</p>
          </div>
        </form>
      </FormSheet>
    </div>
  );
}
