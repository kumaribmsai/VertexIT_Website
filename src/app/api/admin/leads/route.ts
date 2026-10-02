import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";

// GET /api/admin/leads — list with filters
export async function GET(req: NextRequest) {
  const { error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const q = url.searchParams.get("q") || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = 20;

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? { OR: [{ fullName: { contains: q } }, { phone: { contains: q } }, { email: { contains: q } }] }
      : {}),
  };

  const [total, leads] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { course: { select: { title: true } } },
    }),
  ]);
  return ok({ leads, total, page, pageSize });
}

// POST /api/admin/leads — create manually (walk-in, phone enquiry)
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;
  try {
    const body = await req.json();
    const { fullName, phone, email, courseId, education, experienceLevel, preferredMode, message } = body;
    if (!fullName || !phone) {
      return fail("fullName and phone are required", 422);
    }
    const lead = await db.lead.create({
      data: {
        fullName: String(fullName),
        phone: String(phone),
        email: email ? String(email) : null,
        courseId: courseId && courseId !== "general" ? String(courseId) : null,
        education: education ?? null,
        experienceLevel: experienceLevel ?? null,
        preferredMode: preferredMode ?? null,
        message: message ?? "",
        status: "NEW",
        assignedCounsellorId: user.id,
      },
    });
    await db.leadStatusHistory.create({
      data: { leadId: lead.id, toStatus: "NEW", changedById: user.id, changedByName: user.name, note: "Lead created by admin" },
    });
    return ok({ id: lead.id });
  } catch (e) {
    console.error("[api/admin/leads POST]", e);
    return fail("Failed to create lead", 500);
  }
}
