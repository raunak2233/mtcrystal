"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SavingButton, SectionHeader } from "@/components/admin/admin-ui";
import { apiSend } from "@/lib/api-client";
import type { SiteSettings } from "@/lib/types";

const socialFields = [
  { key: "facebookUrl", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
  { key: "instagramUrl", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
  { key: "twitterUrl", label: "Twitter / X", icon: Twitter, placeholder: "https://x.com/..." },
  { key: "youtubeUrl", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@..." },
  { key: "whatsappUrl", label: "WhatsApp", icon: MessageCircle, placeholder: "https://wa.me/91..." },
] as const;

function Panel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-purple-100 p-2.5">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-stone-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SettingsManager({
  settings,
  onRefresh,
}: {
  settings: SiteSettings;
  onRefresh: () => Promise<void>;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const setField = (key: keyof SiteSettings, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      await apiSend("/api/settings", "PUT", form);
      toast.success("Settings saved");
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <SectionHeader
        title="Site Settings"
        description="Contact details and social links used across the footer and contact page."
      >
        <SavingButton type="submit" saving={saving} className="bg-purple-600 hover:bg-purple-700">
          {saving ? "Saving..." : "Save Changes"}
        </SavingButton>
      </SectionHeader>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Email"
          description="Where customers reach you. The first one shows in the footer."
          icon={Mail}
        >
          <div>
            <Label htmlFor="contact-email">Primary email</Label>
            <Input
              id="contact-email"
              type="email"
              value={form.contactEmail}
              onChange={(event) => setField("contactEmail", event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="support-email">Support email</Label>
            <Input
              id="support-email"
              type="email"
              value={form.supportEmail}
              onChange={(event) => setField("supportEmail", event.target.value)}
              placeholder="Optional"
            />
          </div>
        </Panel>

        <Panel title="Phone" description="Shown in the footer and on the contact page." icon={Phone}>
          <div>
            <Label htmlFor="phone-primary">Primary phone</Label>
            <Input
              id="phone-primary"
              value={form.phonePrimary}
              onChange={(event) => setField("phonePrimary", event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone-secondary">Secondary phone</Label>
            <Input
              id="phone-secondary"
              value={form.phoneSecondary}
              onChange={(event) => setField("phoneSecondary", event.target.value)}
              placeholder="Optional"
            />
          </div>
        </Panel>

        <Panel
          title="Address"
          description="Empty lines are skipped, so fill in only what applies."
          icon={MapPin}
        >
          <div>
            <Label htmlFor="address-1">Address line 1</Label>
            <Input
              id="address-1"
              value={form.addressLine1}
              onChange={(event) => setField("addressLine1", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address-2">Address line 2</Label>
            <Input
              id="address-2"
              value={form.addressLine2}
              onChange={(event) => setField("addressLine2", event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="address-city">City</Label>
              <Input
                id="address-city"
                value={form.city}
                onChange={(event) => setField("city", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address-state">State</Label>
              <Input
                id="address-state"
                value={form.state}
                onChange={(event) => setField("state", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address-pincode">Pincode</Label>
              <Input
                id="address-pincode"
                value={form.pincode}
                onChange={(event) => setField("pincode", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address-country">Country</Label>
              <Input
                id="address-country"
                value={form.country}
                onChange={(event) => setField("country", event.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="business-hours">Business hours</Label>
            <Textarea
              id="business-hours"
              rows={3}
              value={form.businessHours}
              onChange={(event) => setField("businessHours", event.target.value)}
            />
            <p className="mt-1 text-xs text-stone-500">One line per row on the contact page.</p>
          </div>
        </Panel>

        <Panel
          title="Social links"
          description="Only filled-in links appear as icons in the footer."
          icon={Instagram}
        >
          {socialFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key}>
                <Label htmlFor={field.key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-stone-500" />
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  value={form[field.key]}
                  onChange={(event) => setField(field.key, event.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            );
          })}
        </Panel>

        <Panel
          title="Footer text"
          description="The blurb under the logo and the closing tagline."
          icon={MessageCircle}
        >
          <div>
            <Label htmlFor="footer-about">About blurb</Label>
            <Textarea
              id="footer-about"
              rows={4}
              value={form.footerAbout}
              onChange={(event) => setField("footerAbout", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="brand-tagline">Tagline</Label>
            <Input
              id="brand-tagline"
              value={form.brandTagline}
              onChange={(event) => setField("brandTagline", event.target.value)}
            />
          </div>
        </Panel>
      </div>

      <div className="flex justify-end">
        <SavingButton type="submit" saving={saving} className="bg-purple-600 hover:bg-purple-700">
          {saving ? "Saving..." : "Save Changes"}
        </SavingButton>
      </div>
    </form>
  );
}
