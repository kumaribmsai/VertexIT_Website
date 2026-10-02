import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { ReferralsManager } from "@/components/admin/referrals-manager";

export const dynamic = "force-dynamic";

export default async function AdminReferralsPage() {
  await requireAdmin("CONTENT_EDITOR");

  const referrals = await db.referral.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { id: true, title: true } } },
    take: 200,
  });

  const serialized = referrals.map((r) => ({
    id: r.id,
    referrerName: r.referrerName,
    referrerPhone: r.referrerPhone,
    referrerEmail: r.referrerEmail,
    friendName: r.friendName,
    friendPhone: r.friendPhone,
    friendEmail: r.friendEmail,
    courseTitle: r.course?.title || null,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Referrals"
        description="Manage friend referrals from the Refer a Friend program."
      />
      <ReferralsManager referrals={serialized} />
    </div>
  );
}
