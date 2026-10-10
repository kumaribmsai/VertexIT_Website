import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts, getBlogCategories } from "@/services/public";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { BlogCard } from "@/components/site/blog-card";
import { EmptyState } from "@/components/site/state";
import { Reveal } from "@/components/site/reveal";
import { BlogCategoryFilter } from "@/components/site/blog-category-filter";
import { LinkButton } from "@/components/site/buttons";
import { NewsletterSignup } from "@/components/site/newsletter-signup";
import { Newspaper, BookOpen } from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "IT career Blog | VertexIT",
  description:
    "Practical insights on IT careers — interview prep, resume tips, IT operations fundamentals and trends in US & Australia IT hiring.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const [categories, allPosts] = await Promise.all([
    getBlogCategories(),
    getPublishedBlogPosts(),
  ]);

  // Resolve category filter via slug
  let activeCategoryId: string | undefined;
  let activeCategoryName: string | undefined;
  if (categorySlug) {
    const cat = categories.find((c) => c.slug === categorySlug);
    if (cat) {
      activeCategoryId = cat.id;
      activeCategoryName = cat.name;
    }
  }

  const posts = activeCategoryId
    ? allPosts.filter((p) => p.categoryId === activeCategoryId)
    : allPosts;

  return (
    <div className="bg-white">
      {/* Hero / heading band */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              align="left"
              eyebrow="CAREER INSIGHTS"
              title="VertexIT Blog"
              description="Practical insights to help you build a IT career — interview preparation, resume tips, IT operations fundamentals and trends in US & Australia IT hiring."
            />
            {posts.length > 0 && (
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-teal/20 bg-teal/5 px-4 py-2 text-sm font-medium text-teal">
                <Newspaper className="h-4 w-4" />
                {posts.length} {posts.length === 1 ? "article" : "articles"}
                {activeCategoryName ? ` in ${activeCategoryName}` : ""}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {categories.length > 0 && (
          <div className="mb-10 -mx-1 overflow-x-auto pb-2">
            <BlogCategoryFilter
              categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
              activeSlug={categorySlug}
            />
          </div>
        )}

        {posts.length === 0 ? (
          <EmptyState
            title="We're publishing new articles soon"
            description="Check back for IT career insights, interview tips and resume guidance. Meanwhile, explore our training programs or speak with a counsellor."
            icon={BookOpen}
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <LinkButton href="/courses" variant="default">
                  Explore Courses
                </LinkButton>
                <LinkButton href="/contact" variant="outline">
                  Contact Us
                </LinkButton>
              </div>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 60}>
                <BlogCard post={post} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA — career resources */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="bg-dot-grid absolute inset-0 opacity-50" aria-hidden />
            <div className="relative">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                Build the skills
              </p>
              <h2 className="mt-2 font-heading text-lg font-bold text-navy">
                Ready to start your IT career?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our courses are designed to make you job-ready — covering everything you'll read about here, with practical case studies.
              </p>
              <div className="mt-4">
                <LinkButton href="/courses" variant="default" size="sm">
                  Explore Courses
                </LinkButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-navy p-6 text-white sm:p-7">
            <div className="bg-dot-grid absolute inset-0 opacity-30" aria-hidden />
            <div className="relative">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                Have a question?
              </p>
              <h2 className="mt-2 font-heading text-lg font-bold">
                Speak with a VertexIT counsellor
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Not sure which program fits your goals? Talk to us — we'll guide you to the right path.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton href="/apply" variant="default" size="sm">
                  Talk to a Counsellor
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

        {/* Newsletter signup */}
        <div className="mt-14">
          <NewsletterSignup source="blog" />
        </div>
      </section>
    </div>
  );
}
