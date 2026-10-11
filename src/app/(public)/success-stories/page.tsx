import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Quote, MapPin, Building2, Briefcase, Sparkles, GraduationCap } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/state";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { getPublishedPlacementStories, getPublishedTestimonials } from "@/services/public";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Success Stories | VertexIT Career Training",
  description:
    "Real career journeys from VertexIT — student outcomes, placement stories and testimonials from our training programs in Bengaluru.",
  path: "/success-stories",
});

type PlacementStory = Awaited<ReturnType<typeof getPublishedPlacementStories>>[number];
type Testimonial = Awaited<ReturnType<typeof getPublishedTestimonials>>[number];

export default async function SuccessStoriesPage() {
  const [stories, testimonials] = await Promise.all([
    getPublishedPlacementStories(),
    getPublishedTestimonials(),
  ]);
  const waHref = await whatsappUrl("placement");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Success Stories" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Student Outcomes
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Real career journeys from VertexIT
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              Stories and testimonials from candidates who trained with VertexIT and moved into
              IT and software operations roles. We only publish verified stories — and we are
              transparent about what we share.
            </p>
          </div>
        </div>
      </section>

      {/* Placement stories */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Placement stories"
            title="Candidates who trained with us"
            description="Each story reflects an individual journey. Outcomes vary — actual hiring depends on employer requirements and candidate suitability."
          />

          <div className="mt-12">
            {stories.length === 0 ? (
              <EmptyState
                title="Student success stories will appear here once available"
                description="Real student success stories will be published here once available. Meanwhile, speak with our counsellor to learn about placement assistance and what to expect."
                icon={Sparkles}
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <WhatsAppButton href={waHref}>WhatsApp Us</WhatsAppButton>
                    <LinkButton href="/apply">Talk to a Counsellor</LinkButton>
                  </div>
                }
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story: PlacementStory, i) => (
                  <Reveal key={story.id} delay={(i % 3) * 80}>
                    <PlacementStoryCard story={story} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Testimonials"
            title="In their words"
            description="Short reflections from candidates who have gone through VertexIT training."
          />
          <div className="mt-12">
            {testimonials.length === 0 ? (
              <EmptyState
                title="Testimonials will appear here soon"
                description="We publish testimonials only after candidates have agreed to share their words. Please check back later or speak with our counsellor."
                icon={Quote}
                action={<LinkButton href="/apply">Talk to a Counsellor</LinkButton>}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t: Testimonial, i) => (
                  <Reveal key={t.id} delay={(i % 3) * 80}>
                    <TestimonialCard t={t} className="h-full" />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
            Your story could be next
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl text-balance">
            Start your own IT career journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Speak with a VertexIT counsellor to find the right training path for your goals — and
            understand how our placement assistance can support you along the way.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <WhatsAppButton href={waHref}>WhatsApp Us</WhatsAppButton>
            <LinkButton
              href="/apply"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-teal hover:text-teal-soft"
            >
              Apply / Enquire
            </LinkButton>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Read our{" "}
            <Link href="/disclaimer" className="font-semibold text-teal-soft hover:text-white">
              disclaimer
            </Link>{" "}
            about placement outcomes.
          </p>
        </div>
      </section>
    </>
  );
}

function PlacementStoryCard({ story }: { story: PlacementStory }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
        {story.photo ? (
          <Image
            src={story.photo}
            alt={story.studentName}
            fill
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient flex items-center justify-center">
            <span className="font-heading text-5xl font-bold text-white/90">
              {story.studentName.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
        {story.course && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-navy backdrop-blur">
            <GraduationCap className="h-3 w-3" /> {story.course}
          </span>
        )}
        {story.year && (
          <span className="absolute right-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-[0.65rem] font-medium text-white backdrop-blur">
            {story.year}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-navy">{story.studentName}</h3>

        {/* From → To */}
        <div className="mt-3 space-y-1.5 text-[0.78rem] text-slate-600">
          {story.previousBackground && (
            <p className="flex items-start gap-1.5">
              <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
              <span>
                <span className="text-slate-400">From: </span>
                {story.previousBackground}
              </span>
            </p>
          )}
          {story.newRole && (
            <p className="flex items-start gap-1.5">
              <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              <span>
                <span className="text-slate-400">Now: </span>
                {story.newRole}
              </span>
            </p>
          )}
          {story.company && (
            <p className="flex items-start gap-1.5">
              <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              <span>{story.company}</span>
            </p>
          )}
          {story.location && (
            <p className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              <span>{story.location}</span>
            </p>
          )}
          {story.package && (
            <p className="flex items-start gap-1.5">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              <span>{story.package}</span>
            </p>
          )}
        </div>

        {story.shortStory && (
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-700">
            {story.shortStory}
          </p>
        )}

        {story.quote && (
          <blockquote className="mt-4 rounded-xl border-l-2 border-teal bg-teal/5 px-4 py-3 text-sm italic leading-relaxed text-slate-700">
            &ldquo;{story.quote}&rdquo;
          </blockquote>
        )}
      </div>
    </article>
  );
}
