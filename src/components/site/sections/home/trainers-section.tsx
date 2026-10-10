import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedTrainers } from "@/services/public";
import { whatsappUrl } from "@/lib/whatsapp";
import { TrainerCard } from "@/components/site/trainer-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

export async function HomeTrainers() {
  let trainers: Awaited<ReturnType<typeof getPublishedTrainers>> = [];
  let waHref = "#";
  try {
    [trainers, waHref] = await Promise.all([
      getPublishedTrainers(),
      whatsappUrl("generic"),
    ]);
  } catch {
    /* graceful */
  }

  // Collapse on homepage when no published trainers — prevents empty-state stacking.
  // The dedicated /trainers page keeps its empty state.
  if (trainers.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Trainers & Mentors"
            title="Learn from experienced mortgage practitioners"
            description="Our trainers bring real mortgage and lending operations experience into the classroom — focused on practical, applied learning."
            className="max-w-2xl"
          />
          <Link
            href="/trainers"
            className="group inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
          >
            Meet all trainers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={i * 60} className="h-full">
                <TrainerCard t={t} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
