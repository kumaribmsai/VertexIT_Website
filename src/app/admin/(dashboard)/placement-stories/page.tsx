import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { PlacementStoriesManager } from "@/components/admin/placement-stories-manager";

export const dynamic = "force-dynamic";

export default async function AdminPlacementStoriesPage() {
  await requireAdmin("CONTENT_EDITOR");
  const stories = await db.placementStory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <PlacementStoriesManager initial={stories} />;
}
