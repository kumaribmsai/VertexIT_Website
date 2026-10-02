import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin-auth";
import { format } from "date-fns";

// GET /api/admin/leads/export — exports all leads (or filtered) as CSV
export async function GET(req: NextRequest) {
  const { error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const q = url.searchParams.get("q") || undefined;

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? { OR: [{ fullName: { contains: q } }, { phone: { contains: q } }, { email: { contains: q } }] }
      : {}),
  };

  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true } },
      assignedCounsellor: { select: { name: true } },
    },
    take: 5000,
  });

  const headers = [
    "Name",
    "Phone",
    "Email",
    "Course",
    "Education",
    "Experience",
    "Preferred Mode",
    "Status",
    "Counsellor",
    "Message",
    "Source",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Created At",
    "Last Contacted",
    "Next Follow-up",
  ];

  function csvCell(v: unknown): string {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  }

  const rows = leads.map((l) =>
    [
      l.fullName,
      l.phone,
      l.email ?? "",
      l.course?.title ?? "General",
      l.education ?? "",
      l.experienceLevel ?? "",
      l.preferredMode ?? "",
      l.status,
      l.assignedCounsellor?.name ?? "",
      l.message ?? "",
      l.utmSource ?? "",
      l.utmMedium ?? "",
      l.utmCampaign ?? "",
      format(new Date(l.createdAt), "yyyy-MM-dd HH:mm:ss"),
      l.lastContactedAt ? format(new Date(l.lastContactedAt), "yyyy-MM-dd HH:mm:ss") : "",
      l.nextFollowUpAt ? format(new Date(l.nextFollowUpAt), "yyyy-MM-dd HH:mm:ss") : "",
    ]
      .map(csvCell)
      .join(","),
  );

  const csv = [headers.map(csvCell).join(","), ...rows].join("\n");
  const filename = `vertexit-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
