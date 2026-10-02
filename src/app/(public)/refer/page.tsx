import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { ReferralForm } from "@/components/site/referral-form";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";
import { UserPlus, Gift, Heart, Share2 } from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "Refer a Friend",
  description:
    "Know someone who would benefit from VertexIT mortgage training? Refer them and we'll follow up. Help your friends build their mortgage career.",
  path: "/refer",
});

export default async function ReferPage() {
  const waHref = await whatsappUrl("generic");

  const benefits = [
    {
      icon: Share2,
      title: "Share the opportunity",
      description: "Tell a friend about VertexIT mortgage training programs — share the link or their contact details.",
    },
    {
      icon: Heart,
      title: "We follow up",
      description: "Our counsellor reaches out to your friend, explains the programs, and helps them find the right path.",
    },
    {
      icon: Gift,
      title: "They get started",
      description: "If your friend enrolls, you'll hear from us with a thank-you. Helping friends build careers is its own reward.",
    },
  ];

  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Refer a Friend" }]} />
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal">
              <UserPlus className="h-3.5 w-3.5" />
              Referral Program
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl text-balance">
              Help a friend build their mortgage career
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
              Know someone who would benefit from VertexIT training? Refer them and our team will reach out with personalised guidance. Helping friends start a career in mortgage operations is one of the best things you can do.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left — how it works */}
            <div>
              <Reveal>
                <h2 className="font-heading text-2xl font-bold text-navy">How it works</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Three simple steps to help your friend start their mortgage career.
                </p>
              </Reveal>
              <div className="mt-8 space-y-6">
                {benefits.map((b, i) => (
                  <Reveal key={b.title} delay={i * 80}>
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                        <b.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-teal">
                          Step {i + 1}
                        </span>
                        <h3 className="mt-0.5 font-heading text-base font-bold text-navy">{b.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={240}>
                <div className="mt-8 rounded-2xl border border-teal/20 bg-teal/5 p-5">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-navy">Why refer?</span> Mortgage operations is a growing field in Bengaluru with strong demand for trained candidates. By referring a friend, you're helping them access a structured path into this industry.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right — referral form */}
            <Reveal delay={120}>
              <ReferralForm />
            </Reveal>
          </div>

          {/* Quick CTA */}
          <Reveal delay={200}>
            <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Prefer to share a link instead? Send your friend to our courses page:
              </p>
              <div className="flex gap-2">
                <WhatsAppButton href={waHref} size="sm">
                  Share on WhatsApp
                </WhatsAppButton>
                <LinkButton href="/courses" variant="outline" size="sm">
                  View courses page
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
