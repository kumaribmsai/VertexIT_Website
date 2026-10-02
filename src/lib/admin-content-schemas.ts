import { z } from "zod";

// ============================================================
// Shared zod schemas for admin Jobs + Blog CMS routes.
// Used by POST (create) and PUT (update) handlers.
// ============================================================

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
const WORK_MODES = ["Onsite", "Remote", "Hybrid"] as const;

// Accept ISO date strings OR yyyy-mm-dd inputs; null is valid (no closing date).
const isoOrUndefined = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (!v || v === "") return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  });

export const jobSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  company: z.string().max(200).optional().default(""),
  location: z.string().max(200).optional().default(""),
  experience: z.string().max(120).optional().default(""),
  salary: z.string().max(120).nullable().optional(),
  jobType: z.enum(JOB_TYPES).optional().default("Full-time"),
  workMode: z.enum(WORK_MODES).optional().default("Onsite"),
  courseDomain: z.string().max(200).nullable().optional(),
  skills: z.string().optional().default(""),
  responsibilities: z.string().optional().default(""),
  requirements: z.string().optional().default(""),
  description: z.string().optional().default(""),
  closingDate: isoOrUndefined,
  isPublished: z.boolean().optional().default(false),
  isExpired: z.boolean().optional().default(false),
  isDemo: z.boolean().optional().default(false),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
});

export type JobInput = z.infer<typeof jobSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  excerpt: z.string().max(500).optional().default(""),
  content: z.string().optional().default(""),
  featuredImage: z.string().max(500).nullable().optional(),
  categoryId: z.string().nullable().optional(),
  author: z.string().max(120).optional().default("VertexIT"),
  tags: z.string().max(500).optional().default(""),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
  canonicalUrl: z.string().max(500).nullable().optional(),
  ogTitle: z.string().max(200).nullable().optional(),
  ogDescription: z.string().max(500).nullable().optional(),
  ogImage: z.string().max(500).nullable().optional(),
  publishedAt: isoOrUndefined,
  isPublished: z.boolean().optional().default(false),
  isDemo: z.boolean().optional().default(false),
  courseId: z.string().nullable().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// Generate a URL-safe slug from a title (used by the form auto-slug feature).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// ============================================================
// COURSE schema — used by admin Courses CMS (POST/PUT handlers
// and the client CourseForm component).
// ============================================================

export const COURSE_TRAINING_MODES = ["ONLINE", "OFFLINE", "HYBRID", "LIVE", "RECORDED"] as const;
export const COURSE_STATUSES = ["ACTIVE", "UPCOMING", "ARCHIVED"] as const;

const courseModuleSchema = z.object({
  title: z.string().min(1, "Module title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").default(""),
});

const courseOutcomeSchema = z.object({
  text: z.string().min(1, "Outcome text is required").max(500, "Too long"),
});

const courseFaqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Too long"),
  answer: z.string().min(1, "Answer is required").max(2000, "Too long"),
});

export const courseSchema = z.object({
  // Basics
  title: z.string().min(2, "Title must be at least 2 characters").max(200, "Title too long"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(150, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  shortDescription: z
    .string()
    .min(5, "Add a short description")
    .max(300, "Short description too long (max 300 chars)"),
  featuredImage: z.string().max(500).nullable().optional(),
  trainingMode: z.enum(COURSE_TRAINING_MODES).default("HYBRID"),
  status: z.enum(COURSE_STATUSES).default("ACTIVE"),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),

  // Content (long-form text blocks)
  introduction: z.string().max(20000).default(""),
  whoFor: z.string().max(20000).default(""),
  whatYouLearn: z.string().max(20000).default(""),
  practicalLearning: z.string().max(20000).default(""),
  caseStudies: z.string().max(20000).default(""),
  careerRoles: z.string().max(20000).default(""),
  placementAssistance: z.string().max(20000).default(""),
  eligibility: z.string().max(10000).default(""),

  // Skills & Pathways (newline-separated plain text)
  keySkills: z.string().max(5000).default(""),
  careerPathways: z.string().max(5000).default(""),

  // Schedule (duration nullable → public site shows "To be confirmed")
  duration: z.string().max(100).nullable().optional(),
  batchSchedule: z.string().max(200).nullable().optional(),
  courseFee: z.string().max(200).nullable().optional(),

  // SEO
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
  canonicalUrl: z.string().max(500).nullable().optional(),
  ogTitle: z.string().max(200).nullable().optional(),
  ogDescription: z.string().max(500).nullable().optional(),
  ogImage: z.string().max(500).nullable().optional(),

  // Publishing
  isPublished: z.boolean().default(false),
  isDemo: z.boolean().default(false),

  // Relations (replace-all on PUT)
  modules: z.array(courseModuleSchema).default([]),
  outcomes: z.array(courseOutcomeSchema).default([]),
  faqs: z.array(courseFaqSchema).default([]),
});

export type CourseInput = z.infer<typeof courseSchema>;
