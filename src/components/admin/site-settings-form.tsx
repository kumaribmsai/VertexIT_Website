"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdminPageHeader, AdminCard } from "@/components/admin/primitives";

export type SettingsForm = {
  brandName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  businessHours: string;
  mapEmbedUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImage: string;
  finalCtaHeading: string;
  finalCtaSubheading: string;
  defaultSeoTitle: string;
  defaultSeoDesc: string;
  defaultOgImage: string;
};

type Props = {
  initial: SettingsForm;
};

export function SiteSettingsForm({ initial }: Props) {
  const [form, setForm] = useState<SettingsForm>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        email: form.email.trim() || null,
        addressLine: form.addressLine.trim() || null,
        mapEmbedUrl: form.mapEmbedUrl.trim() || null,
        logoUrl: form.logoUrl.trim() || null,
        faviconUrl: form.faviconUrl.trim() || null,
        instagramUrl: form.instagramUrl.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
        facebookUrl: form.facebookUrl.trim() || null,
        youtubeUrl: form.youtubeUrl.trim() || null,
        heroImage: form.heroImage.trim() || null,
        defaultSeoTitle: form.defaultSeoTitle.trim() || null,
        defaultSeoDesc: form.defaultSeoDesc.trim() || null,
        defaultOgImage: form.defaultOgImage.trim() || null,
      };
      const res = await fetch(`/api/admin/site-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      toast.success("Settings saved");
      setForm(json.settings);
    } catch {
      toast.error("Couldn't save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Control brand, contact details, social links, homepage copy and SEO defaults. Changes appear on the public site immediately."
        actions={
          <Button onClick={save} disabled={saving} className="bg-navy text-white hover:bg-navy/90">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        }
      />

      <div className="grid gap-6">
        {/* Brand */}
        <AdminCard title="Brand" description="Name and tagline shown in the header and footer.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Brand name</Label>
              <Input value={form.brandName} onChange={(e) => set("brandName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo URL</Label>
              <Input value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="/uploads/logo.png" />
            </div>
            <div className="space-y-1.5">
              <Label>Favicon URL</Label>
              <Input value={form.faviconUrl} onChange={(e) => set("faviconUrl", e.target.value)} placeholder="/uploads/favicon.ico" />
            </div>
          </div>
        </AdminCard>

        {/* Contact */}
        <AdminCard title="Contact" description="Phone, email, address and map. Leave optional fields empty to hide them publicly.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp (with country code, no +)</Label>
              <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="919703686514" />
            </div>
            <div className="space-y-1.5">
              <Label>Email (leave empty to hide)</Label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@vertexit.in" />
            </div>
            <div className="space-y-1.5">
              <Label>Address line</Label>
              <Input value={form.addressLine} onChange={(e) => set("addressLine", e.target.value)} placeholder="GB Play" />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>State</Label>
              <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Business hours</Label>
              <Input value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Google Maps embed URL</Label>
              <Input value={form.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
              <p className="text-xs text-muted-foreground">Paste the full src URL from Google Maps → Share → Embed a map.</p>
            </div>
          </div>
        </AdminCard>

        {/* Social */}
        <AdminCard title="Social Links" description="Leave empty to hide the corresponding icon in the footer and contact page.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Instagram URL</Label>
              <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/company/..." />
            </div>
            <div className="space-y-1.5">
              <Label>Facebook URL</Label>
              <Input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label>YouTube URL</Label>
              <Input value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/@..." />
            </div>
          </div>
        </AdminCard>

        {/* Homepage */}
        <AdminCard title="Homepage Hero & Final CTA" description="Top hero copy and the closing call-to-action section.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Hero eyebrow</Label>
              <Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hero image URL</Label>
              <Input value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} placeholder="/uploads/hero.jpg" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Hero heading</Label>
              <Input value={form.heroHeading} onChange={(e) => set("heroHeading", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Hero subheading</Label>
              <Textarea rows={3} value={form.heroSubheading} onChange={(e) => set("heroSubheading", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hero primary CTA label</Label>
              <Input value={form.heroPrimaryCta} onChange={(e) => set("heroPrimaryCta", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hero secondary CTA label</Label>
              <Input value={form.heroSecondaryCta} onChange={(e) => set("heroSecondaryCta", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Final CTA heading</Label>
              <Input value={form.finalCtaHeading} onChange={(e) => set("finalCtaHeading", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Final CTA subheading</Label>
              <Textarea rows={3} value={form.finalCtaSubheading} onChange={(e) => set("finalCtaSubheading", e.target.value)} />
            </div>
          </div>
        </AdminCard>

        {/* SEO */}
        <AdminCard title="SEO Defaults" description="Fallback title, description and OG image used by pages without dedicated SEO overrides.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Default SEO title</Label>
              <Input value={form.defaultSeoTitle} onChange={(e) => set("defaultSeoTitle", e.target.value)} placeholder="VertexIT — Career-Focused Mortgage Training" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Default SEO description</Label>
              <Textarea rows={3} value={form.defaultSeoDesc} onChange={(e) => set("defaultSeoDesc", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Default OG image URL</Label>
              <Input value={form.defaultOgImage} onChange={(e) => set("defaultOgImage", e.target.value)} placeholder="/uploads/og-default.jpg" />
            </div>
          </div>
        </AdminCard>

        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving} className="bg-navy text-white hover:bg-navy/90">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
