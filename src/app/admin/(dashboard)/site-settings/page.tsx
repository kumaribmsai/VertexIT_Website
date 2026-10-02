import { db } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-auth";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  await requireAdmin("CONTENT_EDITOR");

  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } }) ?? DEFAULT_SETTINGS;

  // Normalize nullable fields → "" for the client form state.
  const initial = {
    brandName: settings.brandName,
    tagline: settings.tagline,
    logoUrl: settings.logoUrl ?? "",
    faviconUrl: settings.faviconUrl ?? "",
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email ?? "",
    addressLine: settings.addressLine ?? "",
    city: settings.city,
    state: settings.state,
    country: settings.country,
    businessHours: settings.businessHours,
    mapEmbedUrl: settings.mapEmbedUrl ?? "",
    instagramUrl: settings.instagramUrl ?? "",
    linkedinUrl: settings.linkedinUrl ?? "",
    facebookUrl: settings.facebookUrl ?? "",
    youtubeUrl: settings.youtubeUrl ?? "",
    heroEyebrow: settings.heroEyebrow,
    heroHeading: settings.heroHeading,
    heroSubheading: settings.heroSubheading,
    heroPrimaryCta: settings.heroPrimaryCta,
    heroSecondaryCta: settings.heroSecondaryCta,
    heroImage: settings.heroImage ?? "",
    finalCtaHeading: settings.finalCtaHeading,
    finalCtaSubheading: settings.finalCtaSubheading,
    defaultSeoTitle: settings.defaultSeoTitle ?? "",
    defaultSeoDesc: settings.defaultSeoDesc ?? "",
    defaultOgImage: settings.defaultOgImage ?? "",
  };

  return <SiteSettingsForm initial={initial} />;
}
