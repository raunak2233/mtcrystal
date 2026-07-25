"use client";

import type React from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/** Title, subtitle and a primary action, stacked on phones. */
export function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-stone-600">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {actionLabel && onAction ? (
          <Button onClick={onAction} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-6 bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

/**
 * Slide-over that holds the create/edit forms. Full width on phones, a panel on
 * larger screens, so the list stays the main surface.
 */
export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-stone-200 px-6 py-5 text-left">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">
          {footer}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Delete control that always asks first and names what is about to go. */
export function ConfirmDeleteButton({
  itemLabel,
  itemName,
  onConfirm,
  disabled,
  size = "sm",
  className,
  extraWarning,
}: {
  itemLabel: string;
  itemName: string;
  onConfirm: () => void;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  extraWarning?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={size}
          disabled={disabled}
          className={`border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 ${className || ""}`}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{itemName}&rdquo; will be permanently removed. This cannot be undone.
            {extraWarning ? ` ${extraWarning}` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete {itemLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SavingButton({
  saving,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { saving: boolean }) {
  return (
    <Button {...props} disabled={saving || props.disabled}>
      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold sm:text-3xl">{value}</p>
    </div>
  );
}

export function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-stone-800">{label}</p>
      {children}
      {hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
