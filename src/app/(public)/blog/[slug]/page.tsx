import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { CalendarDays, User, Tag, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";

import { db } from "@/lib/db";
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/services/public";
import { buildPageMetadata, blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { ShareButtons } from "@/components/site/share-buttons";

export async function generateStaticParams() {
  try {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.isPublished || !post.publishedAt || post.publishedAt > new Date()) {
    return {};
  }
  return buildPageMetadata({
    title: post.metaTitle || `${post.title} | VertexIT Blog`,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage || undefined,
    type: "article",
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (
    !post ||
    !post.isPublished ||
    !post.publishedAt ||
    post.publishedAt > new Date()
  ) {
    notFound();
  }

  const [related, waHref] = await Promise.all([
    getRelatedBlogPosts(post, 3),
    whatsappUrl("contact"),
  ]);

  // Fetch more posts by the same author (excluding current post)
  const authorPosts = await db.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
      author: post.author,
      id: { not: post.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  // Resolve related course via post.courseId
  let courseLink: { slug: string; title: string } | null = null;
  if (post.courseId) {
    const c = await db.course.findUnique({
      where: { id: post.courseId },
      select: { slug: true, title: true, isPublished: true },
    });
    if (c && c.isPublished) {
      courseLink = { slug: c.slug, title: c.title };
    }
  }

  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const publishedDate = new Date(post.publishedAt);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbItems = [
    { name: "Home", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
  ];

  return (
    <article className="bg-white">
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      {/* Hero */}
      <header className="border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          {post.category && (
            <Link
              href={`/blog?category=${encodeURIComponent(post.category.slug)}`}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-teal transition-colors hover:bg-teal/20"
            >
              <Tag className="h-3 w-3" /> {post.category.name}
            </Link>
          )}
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-[2.5rem] text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
              {post.excerpt}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <Link
              href={`/blog/author/${encodeURIComponent(post.author)}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-teal"
            >
              <User className="h-4 w-4 text-teal" /> {post.author}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-teal" />
              {format(publishedDate, "d MMMM yyyy")}
            </span>
          </div>
        </div>
      </header>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative -mt-2 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-navy">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="prose-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h2 className="mt-10 font-heading text-2xl font-bold text-navy sm:text-3xl">
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2 className="mt-8 font-heading text-xl font-bold text-navy sm:text-2xl">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-6 font-heading text-lg font-semibold text-navy">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mt-4 text-[0.975rem] leading-relaxed text-slate-700">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mt-4 space-y-2 pl-5 text-[0.95rem] text-slate-700 [list-style-type:disc]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-4 space-y-2 pl-5 text-[0.95rem] text-slate-700 [list-style-type:decimal]">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target={href && href.startsWith("http") ? "_blank" : undefined}
                  rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal/80"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mt-6 border-l-4 border-teal/40 bg-teal/5 px-4 py-2 text-[0.925rem] italic text-slate-700">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-navy">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              hr: () => <hr className="my-8 border-slate-200" />,
              code: ({ children }) => (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-navy">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {children}
                </pre>
              ),
            }}
          >
            {post.content || ""}
          </ReactMarkdown>
        </div>

        {/* Share buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4">
          <ShareButtons
            url={`/blog/${post.slug}`}
            title={post.title}
          />
          <a
            href={`https://wa.me/919703686514?text=${encodeURIComponent(`Hi VertexIT, I just read your article "${post.title}" and I'd like to know more.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80"
          >
            <MessageCircle className="h-4 w-4" /> Discuss on WhatsApp
          </a>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Tag className="h-3.5 w-3.5" /> Tags
            </span>
            {tags.map((t) => (
              <Link
                key={t}
                href={`/blog/tag/${t.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 transition-colors hover:bg-teal/10 hover:text-teal"
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Author footer */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5">
              <User className="h-5 w-5 text-navy" />
            </span>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Written by
              </p>
              <Link
                href={`/blog/author/${encodeURIComponent(post.author)}`}
                className="mt-0.5 inline-block font-heading text-base font-semibold text-navy transition-colors hover:text-teal"
              >
                {post.author}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                VertexIT — career-focused professional training.
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <WhatsAppButton href={waHref} size="sm" variant="outline">
              <MessageCircle className="h-4 w-4" /> Ask a question
            </WhatsAppButton>
          </div>
        </div>

        {/* CTA — course + contact */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {courseLink ? (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
              <div className="bg-dot-grid absolute inset-0 opacity-50" aria-hidden />
              <div className="relative">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                  Recommended training
                </p>
                <h2 className="mt-2 font-heading text-lg font-bold text-navy">
                  {courseLink.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Build the practical skills this article talks about — through structured, job-focused training.
                </p>
                <div className="mt-4">
                  <LinkButton href={`/courses/${courseLink.slug}`} variant="default" size="sm">
                    View Course <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
              <div className="bg-dot-grid absolute inset-0 opacity-50" aria-hidden />
              <div className="relative">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                  Keep learning
                </p>
                <h2 className="mt-2 font-heading text-lg font-bold text-navy">
                  Explore training programs
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Job-ready programs in US IT Training and Australia IT operations.
                </p>
                <div className="mt-4">
                  <LinkButton href="/courses" variant="default" size="sm">
                    Browse Courses <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </div>
            </div>
          )}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-navy p-6 text-white">
            <div className="bg-dot-grid absolute inset-0 opacity-30" aria-hidden />
            <div className="relative">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                Have a question?
              </p>
              <h2 className="mt-2 font-heading text-lg font-bold">
                Speak with a VertexIT counsellor
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                We'll help you map your career path and choose the right training.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton href="/placement-process" variant="default" size="sm">
                  Placement Process
                </LinkButton>
                <Link
                  href="/contact"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:border-teal hover:text-teal-soft"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-medium text-teal hover:text-teal/80"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <Link href="/courses" className="font-medium text-teal hover:text-teal/80">
            Courses
          </Link>
          <Link href="/placement-process" className="font-medium text-teal hover:text-teal/80">
            Placement Process
          </Link>
          <Link href="/contact" className="font-medium text-teal hover:text-teal/80">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                  Keep reading
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-navy sm:text-3xl">
                  Related articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden text-sm font-semibold text-teal hover:text-teal/80 sm:inline-flex sm:items-center sm:gap-1.5"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <BlogCard post={p} className="h-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* More by this author */}
      {authorPosts.length > 0 && (
        <section className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                  More from this author
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-navy sm:text-3xl">
                  More by {post.author}
                </h2>
              </div>
              <Link
                href={`/blog/author/${encodeURIComponent(post.author)}`}
                className="hidden text-sm font-semibold text-teal hover:text-teal/80 sm:inline-flex sm:items-center sm:gap-1.5"
              >
                View all by {post.author} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <BlogCard post={p} className="h-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
