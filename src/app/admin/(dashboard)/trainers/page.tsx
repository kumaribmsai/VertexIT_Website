import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { TrainersManager } from "@/components/admin/trainers-manager";

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  await requireAdmin("CONTENT_EDITOR");
  const trainers = await db.trainer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <TrainersManager initialTrainers={trainers} />;
}
