import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  referrerName: z.string().min(2, "Your name is required").max(80),
  referrerPhone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  referrerEmail: z.string().email().optional().or(z.literal("")),
  friendName: z.string().min(2, "Friend's name is required").max(80),
  friendPhone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  friendEmail: z.string().email().optional().or(z.literal("")),
  courseId: z.string().optional(),
  message: z.string().max(2000).optional(),
});

// POST /api/referral — refer a friend
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

    const { referrerName, referrerPhone, referrerEmail, friendName, friendPhone, friendEmail, courseId, message } = parsed.data;

    const referral = await db.referral.create({
      data: {
        referrerName: referrerName.trim(),
        referrerPhone: referrerPhone.trim(),
        referrerEmail: referrerEmail?.trim() || null,
        friendName: friendName.trim(),
        friendPhone: friendPhone.trim(),
        friendEmail: friendEmail?.trim() || null,
        courseId: courseId || null,
        message: message?.trim() || "",
        status: "NEW",
      },
    });

    // Create admin notification
    await db.adminNotification.create({
      data: {
        type: "SYSTEM",
        title: `New referral from ${referrerName}`,
        message: `Referring: ${friendName} · ${friendPhone}`,
        link: "/admin/referrals",
      },
    }).catch(() => {});

    return NextResponse.json({ ok: true, id: referral.id });
  } catch (e) {
    console.error("[api/referral] error:", e);
    return NextResponse.json(
      { ok: false, error: "We couldn't submit your referral right now." },
      { status: 500 },
    );
  }
}
