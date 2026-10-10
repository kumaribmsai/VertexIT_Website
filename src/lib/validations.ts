import { z } from "zod";

// Indian mobile: 10 digits, starts with 6-9.
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const leadSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long")
    .refine((v) => !/<|>|script|javascript:/i.test(v), "Invalid characters in name"),
  phone: phoneSchema,
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  courseId: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  experienceLevel: z.string().optional().nullable(),
  preferredMode: z.string().optional().nullable(),
  message: z.string().max(2000, "Message is too long").optional(),
  howDidYouHear: z.string().optional().nullable(),
  // Honeypot — must be empty
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, "Job is required"),
  candidateName: z
    .string()
    .min(2, "Please enter your name")
    .max(80),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  coverMessage: z.string().max(2000, "Message too long").optional().default(""),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Sanitization — strip HTML/script tags from free text to prevent stored XSS.
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip tags
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function safeStringify(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
}
