import { db } from "@/lib/db";

// In-memory cache for site settings (singleton row, rarely changes).
let cachedSettings: Awaited<ReturnType<typeof fetchSettings>> | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

type SiteSettingsRow = NonNullable<Awaited<ReturnType<typeof fetchSettings>>>;

async function fetchSettings() {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    return row;
  } catch (e) {
    // Database may not be ready yet (e.g. during build). Fail gracefully.
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettingsRow | DefaultSettings> {
  if (cachedSettings && Date.now() < cacheExpiry) {
    return cachedSettings;
  }
  const row = await fetchSettings();
  cachedSettings = row ?? DEFAULT_SETTINGS;
  cacheExpiry = Date.now() + CACHE_TTL_MS;
  return cachedSettings;
}

export function clearSettingsCache() {
  cachedSettings = null;
  cacheExpiry = 0;
}

export const DEFAULT_SETTINGS = {
  id: "singleton",
  brandName: "VertexIT",
  tagline: "LEARN • APPLY",
  phone: "9703686514",
  whatsapp: "9703686514",
  email: null as string | null,
  addressLine: "GB Play",
  city: "Bengaluru",
  state: "Karnataka",
  country: "India",
  businessHours: "9:00 AM - 8:00 PM",
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
  defaultOgImage: null as string | null,
  defaultSeoTitle: null as string | null,
  defaultSeoDesc: null as string | null,
  instagramUrl: null as string | null,
  linkedinUrl: null as string | null,
  facebookUrl: null as string | null,
  youtubeUrl: null as string | null,
  mapEmbedUrl: null as string | null,
  heroEyebrow: "CAREER-FOCUSED PROFESSIONAL TRAINING",
  heroHeading: "Build the Right Skills for a Better Career",
  heroSubheading:
    "Industry-focused professional training programs designed for graduates, experienced professionals, and career switchers.",
  heroPrimaryCta: "WhatsApp Us",
  heroSecondaryCta: "Explore Courses",
  heroImage: null as string | null,
  finalCtaHeading: "Ready to launch your career?",
  finalCtaSubheading:
    "Speak with a VertexIT counsellor today and find the right path for your goals.",
  updatedAt: new Date(),
} as const;

export type DefaultSettings = typeof DEFAULT_SETTINGS;
