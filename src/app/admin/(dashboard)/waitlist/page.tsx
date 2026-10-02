import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { WaitlistManager } from "@/components/admin/waitlist-manager";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  await requireAdmin("CONTENT_EDITOR");

  const entries = await db.courseWaitlist.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { id: true, title: true, slug: true } } },
    take: 200,
  });

  const serialized = entries.map((e) => ({
    id: e.id,
    courseId: e.courseId,
    courseTitle: e.course?.title || "Unknown",
    courseSlug: e.course?.slug || "",
    fullName: e.fullName,
    phone: e.phone,
    email: e.email,
    message: e.message,
    status: e.status,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Course Waitlist"
        description="Candidates who joined the waitlist for upcoming batches."
      />
      <WaitlistManager entries={serialized} />
    </div>
  );
}
