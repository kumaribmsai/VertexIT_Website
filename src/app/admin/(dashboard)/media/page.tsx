import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { MediaManager } from "@/components/admin/media-manager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireAdmin("CONTENT_EDITOR");
  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      filename: true,
      url: true,
      mimeType: true,
      size: true,
      altText: true,
      createdAt: true,
    },
  });
  const serialized = assets.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));
  return <MediaManager initial={serialized} />;
}
