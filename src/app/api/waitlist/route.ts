import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().min(1, "Course is required"),
  fullName: z.string().min(2, "Name is required").max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
});

// POST /api/waitlist — join course waitlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const { courseId, fullName, phone, email, message } = parsed.data;

    // Verify course exists and is published
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || !course.isPublished) {
      return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
    }

    const entry = await db.courseWaitlist.create({
      data: {
        courseId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        message: message?.trim() || "",
        status: "WAITING",
      },
    });

    // Create admin notification
    await db.adminNotification.create({
      data: {
        type: "SYSTEM",
        title: `New waitlist signup: ${fullName}`,
        message: `${course.title} · ${phone}`,
        link: "/admin/waitlist",
      },
    }).catch(() => {});

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (e) {
    console.error("[api/waitlist] error:", e);
    return NextResponse.json(
      { ok: false, error: "We couldn't add you to the waitlist right now." },
      { status: 500 },
    );
  }
}
