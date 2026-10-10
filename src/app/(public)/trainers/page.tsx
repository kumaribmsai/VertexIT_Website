import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TrainerCard } from "@/components/site/trainer-card";
import { EmptyState } from "@/components/site/state";
import { LinkButton, WhatsAppButton } from "@/components/site/buttons";
import { getPublishedTrainers } from "@/services/public";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Trainers & Mentors | VertexIT",
  description:
    "Learn from IT operations practitioners at VertexIT. Our mentors bring real IT and software operations experience to your training.",
  path: "/trainers",
});

type Trainer = Awaited<ReturnType<typeof getPublishedTrainers>>[number];

export default async function TrainersPage() {
  const [trainers, waHref] = await Promise.all([
    getPublishedTrainers(),
    whatsappUrl("contact"),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trainers" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Mentors
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Learn from IT operations practitioners
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              Our mentors bring real IT and software operations experience to the training
              room. They guide you through workflows, documents and scenarios drawn from actual
              industry practice.
            </p>
          </div>
        </div>
      </section>

      {/* Trainer grid */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our mentors"
            title="Practitioners who teach what they do"
            description="Profiles of the mentors who deliver VertexIT training. We publish credentials only with verification — we do not invent qualifications or years of experience."
          />

          <div className="mt-12">
            {trainers.length === 0 ? (
              <EmptyState
                title="Trainer profiles will be published soon"
                description="Our mentors bring real IT and software operations experience. Detailed profiles will be added here as they are verified and approved for publication."
                icon={Users}
                action={<LinkButton href="/apply">Talk to a Counsellor</LinkButton>}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trainers.map((t: Trainer, i) => (
                  <Reveal key={t.id} delay={(i % 3) * 80}>
                    <TrainerCard t={t} className="h-full" />
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
            Want to learn from our mentors?
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl text-balance">
            Speak with a counsellor to get started
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Apply today and our team will help you choose the right course, meet the right mentors,
            and begin your IT operations training.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <LinkButton href="/apply" variant="default">
              Apply Now <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <WhatsAppButton
              href={waHref}
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-teal hover:text-teal-soft"
            >
              WhatsApp Us
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
