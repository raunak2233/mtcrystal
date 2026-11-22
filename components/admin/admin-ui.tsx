"use client";

import type React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, Plus, Trash2, X } from "lucide-react";
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

/**
 * Full-screen editor for forms too big for the side sheet. Built on the Radix
 * primitives directly because the shared DialogContent is a centred card.
 */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col bg-stone-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <header className="relative border-b border-purple-100 bg-white">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
              <DialogPrimitive.Close
                className="rounded-full border border-stone-200 p-2 text-stone-500 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
              <div className="min-w-0 flex-1">
                <DialogPrimitive.Title className="truncate text-lg font-bold text-stone-900 sm:text-xl">
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="hidden truncate text-sm text-stone-500 sm:block">
                  {description}
                </DialogPrimitive.Description>
              </div>
              <div className="flex items-center gap-2">{actions}</div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const sectionTones = {
  purple: "bg-purple-100 text-purple-700",
  pink: "bg-pink-100 text-pink-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700",
} as const;

/** White card with a tinted icon badge; groups one part of a long form. */
export function FormSection({
  icon: Icon,
  tone,
  title,
  hint,
  aside,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof sectionTones;
  title: string;
  hint?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className={`rounded-2xl p-2.5 ${sectionTones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-stone-900">{title}</h3>
          {hint ? <p className="mt-0.5 text-sm text-stone-500">{hint}</p> : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
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
