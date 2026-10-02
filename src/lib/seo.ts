import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site";

export async function buildPageMetadata(opts: {
  title: string;
  description: string;
  path?: string; // e.g. "/courses/us-mortgage-underwriting"
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const path = opts.path ?? "";
  const url = `${siteUrl}${path}`;
  const image = opts.image || settings.defaultOgImage || `${siteUrl}/vertexit-logo.jpeg`;

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: path || "/" },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: settings.brandName,
      type: opts.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: settings.brandName }],
      ...(opts.type === "article" && opts.publishedTime
        ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime ?? opts.publishedTime }
        : {}),
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

// JSON-LD structured data helpers
export function organizationJsonLd(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.brandName,
    alternateName: "VertexIT",
    description: settings.defaultSeoDesc || `${settings.brandName} — ${settings.tagline}`,
    url: siteUrl,
    logo: `${siteUrl}/vertexit-logo.jpeg`,
    image: settings.defaultOgImage || `${siteUrl}/vertexit-logo.jpeg`,
    telephone: `+91${settings.phone}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: settings.state,
      addressCountry: "IN",
      streetAddress: settings.addressLine || undefined,
    },
    areaServed: "IN",
    sameAs: [settings.instagramUrl, settings.linkedinUrl, settings.facebookUrl, settings.youtubeUrl].filter(Boolean),
  };
}

export function courseJsonLd(course: {
  title: string;
  shortDescription: string;
  slug: string;
  trainingMode?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    url: `${siteUrl}/courses/${course.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "VertexIT",
      sameAs: siteUrl,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  author?: string;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  featuredImage?: string | null;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    author: { "@type": "Organization", name: post.author || "VertexIT" },
    publisher: { "@type": "Organization", name: "VertexIT" },
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
  };
}
