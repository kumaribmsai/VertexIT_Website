import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { clearSettingsCache } from "@/lib/site";
import { sanitizeText } from "@/lib/validations";

const settingsSchema = z.object({
  brandName: z.string().min(1).max(120),
  tagline: z.string().max(160).default(""),
  logoUrl: z.string().max(1000).optional().nullable(),
  faviconUrl: z.string().max(1000).optional().nullable(),

  phone: z.string().min(1).max(40),
  whatsapp: z.string().min(1).max(40),
  email: z.string().max(200).optional().nullable(),
  addressLine: z.string().max(300).optional().nullable(),
  city: z.string().max(120).default("Bengaluru"),
  state: z.string().max(120).default("Karnataka"),
  country: z.string().max(120).default("India"),
  businessHours: z.string().max(200).default("10:00 AM - 8:00 PM"),
  mapEmbedUrl: z.string().max(2000).optional().nullable(),

  instagramUrl: z.string().max(1000).optional().nullable(),
  linkedinUrl: z.string().max(1000).optional().nullable(),
  facebookUrl: z.string().max(1000).optional().nullable(),
  youtubeUrl: z.string().max(1000).optional().nullable(),

  heroEyebrow: z.string().max(200).default(""),
  heroHeading: z.string().max(300).default(""),
  heroSubheading: z.string().max(2000).default(""),
  heroPrimaryCta: z.string().max(80).default(""),
  heroSecondaryCta: z.string().max(80).default(""),
  heroImage: z.string().max(1000).optional().nullable(),
  finalCtaHeading: z.string().max(200).default(""),
  finalCtaSubheading: z.string().max(2000).default(""),

  defaultSeoTitle: z.string().max(300).optional().nullable(),
  defaultSeoDesc: z.string().max(2000).optional().nullable(),
  defaultOgImage: z.string().max(1000).optional().nullable(),
});

export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  return ok({ settings });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(settingsSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const cleaned = {
      brandName: sanitizeText(data.brandName),
      tagline: sanitizeText(data.tagline),
      logoUrl: data.logoUrl?.trim() || null,
      faviconUrl: data.faviconUrl?.trim() || null,
      phone: sanitizeText(data.phone),
      whatsapp: sanitizeText(data.whatsapp),
      email: data.email?.trim() || null,
      addressLine: data.addressLine?.trim() || null,
      city: sanitizeText(data.city),
      state: sanitizeText(data.state),
      country: sanitizeText(data.country),
      businessHours: sanitizeText(data.businessHours),
      mapEmbedUrl: data.mapEmbedUrl?.trim() || null,
      instagramUrl: data.instagramUrl?.trim() || null,
      linkedinUrl: data.linkedinUrl?.trim() || null,
      facebookUrl: data.facebookUrl?.trim() || null,
      youtubeUrl: data.youtubeUrl?.trim() || null,
      heroEyebrow: sanitizeText(data.heroEyebrow),
      heroHeading: sanitizeText(data.heroHeading),
      heroSubheading: sanitizeText(data.heroSubheading),
      heroPrimaryCta: sanitizeText(data.heroPrimaryCta),
      heroSecondaryCta: sanitizeText(data.heroSecondaryCta),
      heroImage: data.heroImage?.trim() || null,
      finalCtaHeading: sanitizeText(data.finalCtaHeading),
      finalCtaSubheading: sanitizeText(data.finalCtaSubheading),
      defaultSeoTitle: data.defaultSeoTitle?.trim() || null,
      defaultSeoDesc: data.defaultSeoDesc?.trim() || null,
      defaultOgImage: data.defaultOgImage?.trim() || null,
    };

    const settings = await db.siteSettings.upsert({
      where: { id: "singleton" },
      update: cleaned,
      create: { id: "singleton", ...cleaned },
    });
    clearSettingsCache();
    await withAudit(user, "UPDATE_SITE_SETTINGS", "SiteSettings", "singleton");
    return ok({ settings });
  } catch (e) {
    console.error("[api/admin/site-settings] PUT error:", e);
    return fail("Couldn't save site settings. Please try again.", 500);
  }
}
