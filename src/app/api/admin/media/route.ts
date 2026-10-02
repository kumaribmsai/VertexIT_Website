import { db } from "@/lib/db";
import { requireAdminApi, ok } from "@/lib/admin-api";

export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return ok({ assets });
}
