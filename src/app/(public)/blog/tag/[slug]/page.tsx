import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { BlogCard } from "@/components/site/blog-card";
import { EmptyState } from "@/components/site/state";
import { Reveal } from "@/components/site/reveal";
import { LinkButton } from "@/components/site/buttons";
import { Tag, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: `Articles tagged "${slug}"`,
    description: `Browse all VertexIT blog articles tagged with "${slug}".`,
    path: `/blog/tag/${slug}`,
    noIndex: true,
  });
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: tag } = await params;

  // Fetch all published posts and filter by tag (tags is comma-separated)
  const allPosts = await db.blogPost.findMany({
    where: { isPublished: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  const posts = allPosts.filter((p) => {
    if (!p.tags) return false;
    return p.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .includes(tag.toLowerCase());
  });

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50/80 to-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: `Tag: ${tag}` }]} />
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal">
              <Tag className="h-3.5 w-3.5" />
              Tag
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Articles tagged &ldquo;{tag}&rdquo;
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {posts.length} article{posts.length !== 1 ? "s" : ""} found with this tag.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 60} className="h-full">
                <BlogCard post={post} className="h-full" />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <LinkButton href="/blog" variant="outline">
              ← Back to all articles
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
