import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobApplicationSchema, sanitizeText } from "@/lib/validations";
import { sendJobApplicationNotificationEmail } from "@/lib/email";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

async function saveResume(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new Error("Resume must be a PDF, DOC or DOCX file");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Resume file must be under 5MB");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "private", "resumes");
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);
  return `/private/resumes/${name}`; // path stored; not publicly served
}

// POST /api/job-applications
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const jobId = String(form.get("jobId") || "");
    const candidateName = String(form.get("candidateName") || "");
    const phone = String(form.get("phone") || "");
    const email = String(form.get("email") || "") || undefined;
    const coverMessage = String(form.get("coverMessage") || "");
    const website = String(form.get("website") || ""); // honeypot
    const file = form.get("resume") as File | null;

    const parsed = jobApplicationSchema.safeParse({
      jobId,
      candidateName,
      phone,
      email,
      coverMessage,
      website,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const job = await db.job.findUnique({ where: { id: parsed.data.jobId } });
    if (!job || !job.isPublished || job.isExpired) {
      return NextResponse.json({ ok: false, error: "Job not available" }, { status: 404 });
    }

    let resumeUrl: string | null = null;
    if (file && file.size > 0) {
      try {
        resumeUrl = await saveResume(file);
      } catch (e) {
        return NextResponse.json(
          { ok: false, error: (e as Error).message },
          { status: 422 },
        );
      }
    }

    const app = await db.jobApplication.create({
      data: {
        jobId: job.id,
        candidateName: sanitizeText(parsed.data.candidateName),
        phone: sanitizeText(parsed.data.phone),
        email: parsed.data.email ? sanitizeText(parsed.data.email) : null,
        resumeUrl,
        coverMessage: sanitizeText(parsed.data.coverMessage ?? ""),
        source: "website",
      },
    });

    await db.adminNotification.create({
      data: {
        type: "JOB_APPLICATION",
        title: `New application: ${job.title}`,
        message: `${app.candidateName} · ${app.phone}`,
        link: `/admin/leads`,
      },
    });

    await sendJobApplicationNotificationEmail({
      candidateName: app.candidateName,
      phone: app.phone,
      email: app.email,
      jobTitle: job.title,
      company: job.company || undefined,
      message: app.coverMessage,
      timestamp: app.createdAt.toISOString(),
    });

    return NextResponse.json({ ok: true, id: app.id });
  } catch (e) {
    console.error("[api/job-applications] error:", e);
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your application right now. Please try again or contact us on WhatsApp." },
      { status: 500 },
    );
  }
}
