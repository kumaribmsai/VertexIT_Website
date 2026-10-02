import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/validations";
import {
  sendLeadNotificationEmail,
  sendCandidateConfirmationEmail,
} from "@/lib/email";

// POST /api/leads — public lead submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const data = parsed.data;

    // Resolve course name for email / storage
    let course: { id: string; title: string } | null = null;
    if (data.courseId && data.courseId !== "general") {
      course = await db.course.findUnique({
        where: { id: data.courseId },
        select: { id: true, title: true },
      });
    }

    // Capture tracking metadata from headers / body
    const headers = req.headers;
    const userAgent = headers.get("x-user-agent") || headers.get("user-agent") || undefined;
    const referrer = headers.get("referer") || undefined;
    const utmSource = (body.utmSource as string) || undefined;
    const utmMedium = (body.utmMedium as string) || undefined;
    const utmCampaign = (body.utmCampaign as string) || undefined;
    const utmTerm = (body.utmTerm as string) || undefined;
    const utmContent = (body.utmContent as string) || undefined;
    const landingPage = (body.landingPage as string) || undefined;

    const lead = await db.lead.create({
      data: {
        fullName: sanitizeText(data.fullName),
        phone: sanitizeText(data.phone),
        email: data.email ? sanitizeText(data.email) : null,
        courseId: course?.id ?? null,
        education: data.education ?? null,
        experienceLevel: data.experienceLevel ?? null,
        preferredMode: data.preferredMode ?? null,
        message: sanitizeText(data.message ?? ""),
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer,
        landingPage,
        userAgent,
        status: "NEW",
      },
    });

    await db.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        toStatus: "NEW",
        note: "Lead created from website enquiry",
      },
    });

    await db.adminNotification.create({
      data: {
        type: "LEAD",
        title: `New enquiry from ${lead.fullName}`,
        message: `Course: ${course?.title ?? "General"} · Phone: ${lead.phone}`,
        link: `/admin/leads/${lead.id}`,
      },
    });

    // Send emails (side-effects — fail gracefully)
    const emailPayload = {
      name: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      course: course?.title ?? null,
      education: lead.education,
      experience: lead.experienceLevel,
      trainingMode: lead.preferredMode,
      message: lead.message,
      source: body.source || "website",
      timestamp: lead.createdAt.toISOString(),
    };
    await sendLeadNotificationEmail(emailPayload);
    if (lead.email) {
      await sendCandidateConfirmationEmail(lead.email, lead.fullName);
    }

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error("[api/leads] error:", e);
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your request right now. Please try again or contact us on WhatsApp." },
      { status: 500 },
    );
  }
}
