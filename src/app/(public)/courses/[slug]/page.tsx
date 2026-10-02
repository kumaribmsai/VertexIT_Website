import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Users,
  BookOpen,
  Beaker,
  Briefcase,
  LifeBuoy,
  Layers,
  Clock,
  GraduationCap,
  Award,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Phone,
} from "lucide-react";

import { db } from "@/lib/db";
import { getCourseBySlug } from "@/services/public";
import { getSiteSettings } from "@/lib/site";
import { buildPageMetadata, courseJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateStaticParams() {
  try {
    const courses = await db.course.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return courses.map((c) => ({ slug: c.slug }));
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
  const course = await getCourseBySlug(slug);
  if (!course || !course.isPublished) return {};
  return buildPageMetadata({
    title: course.metaTitle || `${course.title} | VertexIT`,
    description:
      course.metaDescription || course.shortDescription,
    path: `/courses/${course.slug}`,
    image: course.featuredImage || undefined,
    type: "website",
  });
}

function splitLines(input?: string | null): string[] {
  if (!input) return [];
  return input
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function SectionHeadingBlock({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
          {eyebrow}
        </p>
        <h2 className="mt-0.5 font-heading text-xl font-bold text-navy sm:text-2xl">{title}</h2>
      </div>
    </div>
  );
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course || !course.isPublished) {
    notFound();
  }

  const skills = splitLines(course.keySkills);
  const pathways = splitLines(course.careerPathways);
  const modules = course.modules;
  const outcomes = course.outcomes;
  const faqs = course.faqs;
  const duration = course.duration?.trim() || "To be confirmed";

  const [waCourseHref, settings] = await Promise.all([
    whatsappUrl("generic", `Hi VertexIT, I'm interested in the ${course.title} program.`),
    getSiteSettings(),
  ]);
  const callHref = `tel:${settings.phone}`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbItems = [
    { name: "Home", url: siteUrl },
    { name: "Courses", url: `${siteUrl}/courses` },
    { name: course.title, url: `${siteUrl}/courses/${course.slug}` },
  ];

  return (
    <article className="bg-white">
      <JsonLd data={courseJsonLd(course)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      {faqs.length > 0 && <JsonLd data={faqPageJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />}

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-100 bg-navy">
        {course.featuredImage && (
          <Image
            src={course.featuredImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <div className="bg-dot-grid absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <div className="text-white/90">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Courses", href: "/courses" },
                { label: course.title },
              ]}
            />
          </div>
          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/20 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-teal-soft ring-1 ring-teal/30">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" /> {course.trainingMode}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/15">
                <Clock className="h-3 w-3" /> {duration}
              </span>
              {course.status && course.status !== "ACTIVE" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-amber-200 ring-1 ring-amber-300/30">
                  {course.status}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl text-balance">
              {course.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg text-balance">
              {course.shortDescription}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LinkButton href="/apply" variant="default">
                Talk to a Counsellor
              </LinkButton>
              <WhatsAppButton href={waCourseHref} variant="outline">
                WhatsApp Us
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div className="min-w-0 space-y-14">
            {/* Introduction */}
            {course.introduction && (
              <Reveal>
                <section aria-labelledby="intro-heading">
                  <SectionHeadingBlock
                    icon={Sparkles}
                    eyebrow="OVERVIEW"
                    title="Course introduction"
                  />
                  <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.introduction.split(/\n+/).filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  <h3 id="intro-heading" className="sr-only">
                    {course.title} introduction
                  </h3>
                </section>
              </Reveal>
            )}

            {/* Who this course is for */}
            {course.whoFor && (
              <Reveal>
                <section aria-labelledby="who-for-heading">
                  <SectionHeadingBlock
                    icon={Users}
                    eyebrow="WHO IT'S FOR"
                    title="Who this course is for"
                  />
                  <h3 id="who-for-heading" className="sr-only">Who this course is for</h3>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.whoFor}
                  </p>
                </section>
              </Reveal>
            )}

            {/* What you will learn */}
            {course.whatYouLearn && (
              <Reveal>
                <section aria-labelledby="learn-heading">
                  <SectionHeadingBlock
                    icon={BookOpen}
                    eyebrow="CURRICULUM"
                    title="What you will learn"
                  />
                  <h3 id="learn-heading" className="sr-only">What you will learn</h3>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.whatYouLearn}
                  </p>

                  {outcomes.length > 0 && (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {outcomes.map((o) => (
                        <li
                          key={o.id}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                          <span className="text-sm leading-relaxed text-slate-700">{o.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Reveal>
            )}

            {/* Course modules */}
            {modules.length > 0 && (
              <Reveal>
                <section aria-labelledby="modules-heading">
                  <SectionHeadingBlock
                    icon={Layers}
                    eyebrow="STRUCTURE"
                    title="Course modules"
                  />
                  <h3 id="modules-heading" className="sr-only">Course modules</h3>
                  <ol className="mt-6 space-y-3">
                    {modules.map((m, i) => (
                      <li
                        key={m.id}
                        className="group relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal/40"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-heading text-[0.95rem] font-semibold text-navy">
                            {m.title}
                          </h4>
                          {m.description && (
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </Reveal>
            )}

            {/* Practical learning */}
            {course.practicalLearning && (
              <Reveal>
                <section aria-labelledby="practical-heading">
                  <SectionHeadingBlock
                    icon={Beaker}
                    eyebrow="HANDS-ON"
                    title="Practical learning"
                  />
                  <h3 id="practical-heading" className="sr-only">Practical learning</h3>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.practicalLearning}
                  </p>
                </section>
              </Reveal>
            )}

            {/* Case studies */}
            {course.caseStudies && (
              <Reveal>
                <section aria-labelledby="cases-heading">
                  <SectionHeadingBlock
                    icon={Award}
                    eyebrow="APPLIED"
                    title="Case studies & simulations"
                  />
                  <h3 id="cases-heading" className="sr-only">Case studies and simulations</h3>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.caseStudies}
                  </p>
                </section>
              </Reveal>
            )}

            {/* Career roles */}
            {course.careerRoles && (
              <Reveal>
                <section aria-labelledby="careers-heading">
                  <SectionHeadingBlock
                    icon={Briefcase}
                    eyebrow="PATHWAYS"
                    title="Potential career pathways"
                  />
                  <h3 id="careers-heading" className="sr-only">Potential career pathways</h3>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.careerRoles}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    * Career pathways indicate the types of roles this training prepares you for. Outcomes depend on individual effort, hiring conditions and employer requirements.
                  </p>
                </section>
              </Reveal>
            )}

            {/* Placement assistance */}
            {course.placementAssistance && (
              <Reveal>
                <section aria-labelledby="placement-heading">
                  <SectionHeadingBlock
                    icon={LifeBuoy}
                    eyebrow="SUPPORT"
                    title="Placement assistance"
                  />
                  <h3 id="placement-heading" className="sr-only">Placement assistance</h3>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-700">
                    {course.placementAssistance}
                  </p>
                  <div className="mt-5">
                    <Link
                      href="/placement-process"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80"
                    >
                      See our placement process
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </section>
              </Reveal>
            )}

            {/* Eligibility & training mode */}
            {(course.eligibility || course.trainingMode) && (
              <Reveal>
                <section aria-labelledby="logistics-heading">
                  <SectionHeadingBlock
                    icon={GraduationCap}
                    eyebrow="ENTRY & FORMAT"
                    title="Learning mode & eligibility"
                  />
                  <h3 id="logistics-heading" className="sr-only">Learning mode and eligibility</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        Learning mode
                      </p>
                      <p className="mt-1 font-heading text-base font-semibold text-navy">
                        {course.trainingMode || "Hybrid"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        Eligibility
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        {course.eligibility || "Any graduate"}
                      </p>
                    </div>
                  </div>
                </section>
              </Reveal>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <Reveal>
                <section aria-labelledby="faq-heading">
                  <SectionHeadingBlock
                    icon={HelpCircle}
                    eyebrow="CLARITY"
                    title="Course FAQs"
                  />
                  <h3 id="faq-heading" className="sr-only">Course FAQs</h3>
                  <Accordion type="single" collapsible className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 sm:px-5">
                    {faqs.map((f, i) => (
                      <AccordionItem key={f.id} value={`faq-${i}`} className="border-b-slate-100 last:border-b-0">
                        <AccordionTrigger className="text-left font-heading text-[0.95rem] font-semibold text-navy hover:no-underline">
                          {f.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              </Reveal>
            )}

            {/* Disclaimer */}
            <Reveal>
              <aside className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <p className="text-sm leading-relaxed text-amber-900">
                  <strong className="font-semibold">Disclaimer:</strong> Course content is educational. Regulatory and licensing requirements vary by jurisdiction. VertexIT training is intended to build practical industry knowledge and does not constitute legal, financial or licensing advice.
                </p>
              </aside>
            </Reveal>

            {/* Internal links */}
            <Reveal>
              <nav aria-label="Related pages" className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/placement-process"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal/40"
                >
                  <span>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-teal">
                      Career support
                    </span>
                    <span className="mt-0.5 block font-heading text-sm font-semibold text-navy">
                      Placement Process
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal" />
                </Link>
                <Link
                  href="/jobs"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal/40"
                >
                  <span>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-teal">
                      Hiring
                    </span>
                    <span className="mt-0.5 block font-heading text-sm font-semibold text-navy">
                      Current Job Openings
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal" />
                </Link>
                <Link
                  href="/blog"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal/40"
                >
                  <span>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-teal">
                      Insights
                    </span>
                    <span className="mt-0.5 block font-heading text-sm font-semibold text-navy">
                      Career Blog
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal" />
                </Link>
                <Link
                  href="/contact"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal/40"
                >
                  <span>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-teal">
                      Talk to us
                    </span>
                    <span className="mt-0.5 block font-heading text-sm font-semibold text-navy">
                      Contact VertexIT
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal" />
                </Link>
              </nav>
            </Reveal>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:relative lg:block">
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="bg-brand-gradient px-5 py-5 text-white">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                    Program snapshot
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-bold leading-snug">
                    {course.title}
                  </h2>
                </div>
                <div className="space-y-4 p-5">
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <Layers className="h-4 w-4 text-teal" /> Mode
                      </dt>
                      <dd className="font-medium text-navy text-right">{course.trainingMode || "Hybrid"}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4 text-teal" /> Duration
                      </dt>
                      <dd className="font-medium text-navy text-right">{duration}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <GraduationCap className="h-4 w-4 text-teal" /> Eligibility
                      </dt>
                      <dd className="font-medium text-navy text-right max-w-[60%]">{course.eligibility || "Any graduate"}</dd>
                    </div>
                  </dl>

                  {skills.length > 0 && (
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        Key skills
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <li
                            key={s}
                            className="inline-flex items-center rounded-md bg-teal/8 px-2 py-0.5 text-[0.7rem] font-medium text-teal"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pathways.length > 0 && (
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        Potential career pathways
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {pathways.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <LinkButton href="/apply" variant="navy" className="w-full">
                      Talk to a Counsellor
                    </LinkButton>
                    <WhatsAppButton href={waCourseHref} variant="default" className="w-full">
                      WhatsApp Us
                    </WhatsAppButton>
                    <a
                      href={callHref}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-navy/15 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
                    >
                      <Phone className="h-4 w-4" /> Call Us
                    </a>
                  </div>

                  <p className="pt-2 text-center text-[0.7rem] text-muted-foreground">
                    We'll never share your details. Course fee is shared only after counselling.
                  </p>
                </div>
              </div>

              <p className="mt-3 px-2 text-[0.7rem] leading-relaxed text-muted-foreground">
                Have a quick question? Reach out on WhatsApp — we usually reply during business hours.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
