import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/courses/mini?ids=id1,id2,id3
// Returns minimal course data (id, title, slug) for the compare bar.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids") || "";
  const ids = idsParam.split(",").filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ courses: [] });
  }

  const courses = await db.course.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, slug: true },
  });

  // Preserve order of the requested IDs
  const sorted = ids
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return NextResponse.json({ courses: sorted });
}
