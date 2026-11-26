"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_DEFAULTS, CONTENT_GROUPS } from "@/lib/page-content";
import { saveSiteTexts } from "@/lib/api-client";

/**
 * Page-by-page text editor. The client picks a page on the left (or the pill row
 * on a phone) and edits labelled fields — never HTML, never layout. Images,
 * styling and functionality are untouched by design.
 */
export function PageContentManager({
  texts,
  onRefresh,
}: {
  texts: Record<string, string>;
  onRefresh: () => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>(texts);
  const [activeGroupId, setActiveGroupId] = useState(CONTENT_GROUPS[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  // Refresh after a save (or a manual refresh) brings new text in; keep the
  // form in sync without throwing away an in-progress edit.
  useEffect(() => {
    setValues((current) => ({ ...texts, ...current }));
  }, [texts]);

  const activeGroup =
    CONTENT_GROUPS.find((group) => group.id === activeGroupId) ?? CONTENT_GROUPS[0];

  const changedKeys = useMemo(
    () =>
      Object.keys(CONTENT_DEFAULTS).filter(
        (key) => (values[key] ?? CONTENT_DEFAULTS[key]) !== CONTENT_DEFAULTS[key]
      ),
    [values]
  );

  const setField = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.keys(CONTENT_DEFAULTS).map((key) => [key, values[key] ?? CONTENT_DEFAULTS[key]])
      );
      await saveSiteTexts(payload);
      toast.success("Page content saved — the website is updated");
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save page content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Page Content</h2>
          <p className="mt-1 text-sm text-stone-500">
            Pick a page, edit its text, save. Design and photos stay exactly as they are.
          </p>
        </div>
        <Button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px,minmax(0,1fr)]">
        <nav aria-label="Pages" className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {CONTENT_GROUPS.map((group) => {
              const isActive = group.id === activeGroup?.id;
              const groupChanged = group.fields.some(
                (field) => (values[field.key] ?? field.value) !== field.value
              );

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  className={`flex flex-shrink-0 items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition lg:w-full ${
                    isActive
                      ? "border-purple-200 bg-purple-600 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:border-purple-200"
                  }`}
                >
                  <span>{group.title}</span>
                  {groupChanged ? (
                    <span
                      className={`h-2 w-2 flex-shrink-0 rounded-full ${
                        isActive ? "bg-white" : "bg-purple-500"
                      }`}
                      aria-label="Edited"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5">
          {activeGroup ? (
            <>
              <div className="mb-5 border-b border-stone-100 pb-4">
                <h3 className="text-lg font-semibold">{activeGroup.title}</h3>
                <p className="mt-1 text-sm text-stone-500">{activeGroup.description}</p>
              </div>

              <div className="space-y-5">
                {activeGroup.fields.map((field) => {
                  const value = values[field.key] ?? field.value;
                  const isChanged = value !== CONTENT_DEFAULTS[field.key];

                  return (
                    <div key={field.key} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {isChanged ? (
                          <button
                            type="button"
                            onClick={() => setField(field.key, CONTENT_DEFAULTS[field.key])}
                            className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 transition hover:text-purple-700"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                          </button>
                        ) : null}
                      </div>

                      {field.multiline ? (
                        <Textarea
                          id={field.key}
                          rows={3}
                          value={value}
                          onChange={(event) => setField(field.key, event.target.value)}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          value={value}
                          onChange={(event) => setField(field.key, event.target.value)}
                        />
                      )}

                      {field.hint ? (
                        <p className="text-xs text-stone-500">{field.hint}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-stone-100 pt-5">
                <p className="text-xs text-stone-500">
                  {changedKeys.length
                    ? `${changedKeys.length} ${changedKeys.length === 1 ? "field" : "fields"} changed`
                    : "No changes yet"}
                </p>
                <Button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
