import Image from "next/image";
import Link from "next/link";
import { Quote, MapPin, Building2, Sparkles } from "lucide-react";
import { getPublishedPlacementStories } from "@/services/public";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/state";
import { WhatsAppButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";

type Story = Awaited<ReturnType<typeof getPublishedPlacementStories>>[number];

function StoryCard({ s }: { s: Story }) {
  const initials = s.studentName
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 card-hover hover:border-teal/40">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-teal/15" aria-hidden />

      {s.quote ? (
        <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-slate-700">
          &ldquo;{s.quote}&rdquo;
        </blockquote>
      ) : (
        <p className="flex-1 text-[0.95rem] leading-relaxed text-slate-700">
          {s.shortStory}
        </p>
      )}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-navy/10 ring-2 ring-white">
            {s.photo ? (
              <Image src={s.photo} alt={s.studentName} fill sizes="48px" className="object-cover" />
            ) : (
              <span className="inline-flex h-full w-full items-center justify-center bg-brand-gradient text-sm font-bold text-white">
                {initials}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{s.studentName}</p>
            {s.newRole && (
              <p className="truncate text-xs font-medium text-teal">{s.newRole}</p>
            )}
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.7rem] text-muted-foreground">
              {s.course && <span>{s.course}</span>}
              {s.company && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3" aria-hidden />
                  {s.company}
                </span>
              )}
              {s.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {s.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export async function SuccessStories() {
  let stories: Story[] = [];
  let waHref = "#";
  try {
    [stories, waHref] = await Promise.all([
      getPublishedPlacementStories(),
      whatsappUrl("placement"),
    ]);
  } catch {
    /* graceful */
  }

  return (
    <section className="bg-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Success Stories"
          title="Real stories from real placements"
          description="Honest placement stories from candidates who completed our programs. We do not publish fabricated stories — when our candidates share their journeys, you will see them here."
        />

        <div className="mt-10">
          {stories.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Success stories will appear here"
              description="We are intentional about publishing only genuine, verified placement stories. As our candidates progress and consent to share their journeys, you will find them in this section. Speak with a counsellor to learn more about our placement assistance."
              action={<WhatsAppButton href={waHref}>Talk to a counsellor</WhatsAppButton>}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.slice(0, 6).map((s, i) => (
                <Reveal key={s.id} delay={i * 80} className="h-full">
                  <StoryCard s={s} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {stories.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/success-stories"
              className="group inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-semibold text-navy transition-all hover:border-teal hover:text-teal"
            >
              Read more stories
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
