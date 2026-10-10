import type { Metadata } from "next";
import { db } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { BlogCard } from "@/components/site/blog-card";
import { EmptyState } from "@/components/site/state";
import { LinkButton } from "@/components/site/buttons";
import { Reveal } from "@/components/site/reveal";
import Link from "next/link";
import { User, FileText, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const authorName = decodeURIComponent(name);
  return buildPageMetadata({
    title: `Articles by ${authorName}`,
    description: `Browse all VertexIT blog articles written by ${authorName}.`,
    path: `/blog/author/${name}`,
    noIndex: true,
  });
}

export default async function BlogAuthorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const authorName = decodeURIComponent(name);

  // Fetch all published posts by this author
  const posts = await db.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
      author: { equals: authorName },
    },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  // Get count of categories this author has written about
  const categoryIds = new Set(posts.map((p) => p.categoryId).filter(Boolean));
  const categories = await db.blogCategory.findMany({
    where: { id: { in: Array.from(categoryIds) as string[] } },
    select: { id: true, name: true, slug: true },
  });

  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: `Author: ${authorName}` }]} />

          {/* Author header */}
          <div className="mt-8 flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-navy/5 ring-4 ring-white">
              <span className="font-heading text-2xl font-extrabold text-navy">
                {authorName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                <User className="h-3.5 w-3.5" />
                Author
              </span>
              <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {authorName}
              </h1>
              <p className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-teal" />
                  {posts.length} article{posts.length !== 1 ? "s" : ""}
                </span>
                {categories.length > 0 && (
                  <span>
                    · {categories.length} categor{categories.length === 1 ? "y" : "ies"}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Categories:</span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog?category=${c.slug}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-navy transition-colors hover:border-teal hover:text-teal"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {posts.length === 0 ? (
            <EmptyState
              title={`No articles by ${authorName} found`}
              description="This author hasn't published any articles yet, or the author name may be different. Browse all articles instead."
              action={
                <LinkButton href="/blog" variant="navy">
                  <ArrowLeft className="h-4 w-4" /> Browse all articles
                </LinkButton>
              }
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </>
  );
}
