import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendCandidateConfirmationEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: z.string().optional().default("blog"),
});

// POST /api/newsletter — public newsletter signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address" },
        { status: 422 },
      );
    }

    const { email, source } = parsed.data;

    // Upsert — if already subscribed, just reactivate
    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await db.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { isActive: true, source },
        });
      }
      return NextResponse.json({ ok: true, message: "Already subscribed" });
    }

    await db.newsletterSubscriber.create({
      data: { email, source },
    });

    // Send confirmation email (fails gracefully if not configured)
    await sendCandidateConfirmationEmail(email, "Subscriber");

    // Create admin notification
    await db.adminNotification.create({
      data: {
        type: "SYSTEM",
        title: "New newsletter subscriber",
        message: email,
        link: "/admin/newsletter",
      },
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/newsletter] error:", e);
    return NextResponse.json(
      { ok: false, error: "Subscription failed. Please try again." },
      { status: 500 },
    );
  }
}
