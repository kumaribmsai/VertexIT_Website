import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail, withAudit } from "@/lib/admin-api";

// POST /api/admin/waitlist/[id]/convert — convert a waitlist entry into a lead
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;
  const { id } = await params;

  const entry = await db.courseWaitlist.findUnique({
    where: { id },
    include: { course: { select: { id: true, title: true } } },
  });
  if (!entry) return fail("Waitlist entry not found", 404);
  if (entry.status === "ENROLLED") return fail("Already enrolled", 400);

  // Use a transaction: create the lead + update the waitlist entry status
  const lead = await db.$transaction(async (tx) => {
    const newLead = await tx.lead.create({
      data: {
        fullName: entry.fullName,
        phone: entry.phone,
        email: entry.email,
        courseId: entry.courseId,
        message: `Converted from course waitlist for "${entry.course?.title || "Unknown"}".${entry.message ? ` Original message: ${entry.message}` : ""}`,
        status: "NEW",
        assignedCounsellorId: user.id,
        source: "waitlist",
      },
    });

    await tx.leadStatusHistory.create({
      data: {
        leadId: newLead.id,
        toStatus: "NEW",
        changedById: user.id,
        changedByName: user.name,
        note: "Lead created from course waitlist conversion",
      },
    });

    await tx.courseWaitlist.update({
      where: { id },
      data: { status: "ENROLLED" },
    });

    await tx.adminNotification.create({
      data: {
        type: "SYSTEM",
        title: `Waitlist → Lead: ${entry.fullName}`,
        message: `${entry.course?.title || "Unknown course"} · Converted by ${user.name}`,
        link: `/admin/leads/${newLead.id}`,
      },
    });

    return newLead;
  });

  await withAudit(user, "CONVERT_WAITLIST_TO_LEAD", "Lead", lead.id, {
    waitlistId: id,
    leadId: lead.id,
  });

  return ok({ leadId: lead.id });
}
