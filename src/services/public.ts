// Data-access layer for public site content.
// All reads here enforce the "published only" rule for public consumption.

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getPublishedCourses() {
  return db.course.findMany({
    where: { isPublished: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    include: { modules: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getCourseBySlug(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { sortOrder: "asc" } },
      outcomes: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getPublishedJobs() {
  return db.job.findMany({
    where: { isPublished: true, isExpired: false },
    orderBy: { postedDate: "desc" },
  });
}

export async function getJobBySlug(slug: string) {
  return db.job.findUnique({ where: { slug } });
}

export async function getPublishedBlogPosts(opts?: { limit?: number; categoryId?: string }) {
  return db.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
      ...(opts?.categoryId ? { categoryId: opts.categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: opts?.limit,
    include: { category: true },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedBlogPosts(post: { courseId?: string | null; categoryId?: string | null; id: string }, limit = 3) {
  return db.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
      OR: [
        ...(post.categoryId ? [{ categoryId: post.categoryId }] : []),
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getPublishedTrainers() {
  return db.trainer.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getPublishedTestimonials() {
  return db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublishedPlacementStories() {
  return db.placementStory.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublishedFaqs() {
  return db.faq.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getBlogCategories() {
  return db.blogCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getHomepageSections() {
  const rows = await db.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  return rows;
}

export type LeadCreateInput = Prisma.LeadCreateInput;
