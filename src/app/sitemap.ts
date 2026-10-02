import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  // Static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/placement-process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/success-stories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/trainers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/courses/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic course pages
  let courseRoutes: MetadataRoute.Sitemap = [];
  let jobRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const [courses, jobs, posts] = await Promise.all([
      db.course.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.job.findMany({ where: { isPublished: true, isExpired: false }, select: { slug: true, postedDate: true } }),
      db.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true, updatedAt: true } }),
    ]);

    courseRoutes = courses.map((c) => ({
      url: `${siteUrl}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

    jobRoutes = jobs.map((j) => ({
      url: `${siteUrl}/jobs/${j.slug}`,
      lastModified: j.postedDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    blogRoutes = posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.warn("[sitemap] DB unavailable, serving static routes only");
  }

  return [...staticRoutes, ...courseRoutes, ...jobRoutes, ...blogRoutes];
}
