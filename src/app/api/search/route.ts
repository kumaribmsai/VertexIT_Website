import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/search?q=...
// Searches across published courses, blog posts, jobs, and FAQs.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, results: { courses: [], posts: [], jobs: [], faqs: [] } });
  }

  const [courses, posts, jobs, faqs] = await Promise.all([
    db.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { shortDescription: { contains: q } },
          { keySkills: { contains: q } },
          { careerPathways: { contains: q } },
        ],
      },
      select: { id: true, title: true, slug: true, shortDescription: true, trainingMode: true },
      take: 5,
    }),
    db.blogPost.findMany({
      where: {
        isPublished: true,
        OR: [{ title: { contains: q } }, { excerpt: { contains: q } }, { tags: { contains: q } }],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
    db.job.findMany({
      where: {
        isPublished: true,
        isExpired: false,
        OR: [{ title: { contains: q } }, { location: { contains: q } }, { skills: { contains: q } }],
      },
      select: { id: true, title: true, slug: true, location: true, workMode: true, postedDate: true },
      orderBy: { postedDate: "desc" },
      take: 5,
    }),
    db.faq.findMany({
      where: {
        isPublished: true,
        OR: [{ question: { contains: q } }, { answer: { contains: q } }],
      },
      select: { id: true, question: true, answer: true, category: true },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    results: { courses, posts, jobs, faqs },
    total: courses.length + posts.length + jobs.length + faqs.length,
  });
}
