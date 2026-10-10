import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { BookingWidget } from "@/components/site/booking-widget";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";
import { CalendarDays, Phone, MessageCircle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "Book a Counselling Session",
  description:
    "Pick a date and time that works for you. A VertexIT counsellor will confirm your slot and guide you through the right IT training path.",
  path: "/book",
});

export default async function BookPage() {
  const waHref = await whatsappUrl("apply");

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50/80 to-white py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Book counselling" }]} />
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal">
              <CalendarDays className="h-3.5 w-3.5" />
              Counselling Session
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl text-balance">
              Book a 1:1 counselling session
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
              Pick a slot that works for you. A VertexIT counsellor will confirm your booking via WhatsApp and walk you through the right training path for your career goals — no obligation, no payment required.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Booking widget */}
            <div className="lg:col-span-3">
              <Reveal>
                <BookingWidget source="book-page" />
              </Reveal>
            </div>

            {/* Quick contact + trust */}
            <div className="lg:col-span-2">
              <Reveal delay={120}>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-heading text-sm font-semibold text-navy">Prefer to talk now?</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reach us directly — we usually reply during business hours (10 AM – 8 PM).
                    </p>
                    <div className="mt-4 space-y-2">
                      <WhatsAppButton href={waHref} className="w-full" />
                      <a
                        href="tel:9703686514"
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-navy/15 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
                      >
                        <Phone className="h-4 w-4" /> Call 9703686514
                      </a>
                      <LinkButton href="/contact" variant="ghost" size="sm" className="w-full">
                        <MessageCircle className="h-4 w-4" /> Send a message instead
                      </LinkButton>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-teal/20 bg-teal/5 p-5">
                    <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-navy">
                      <ShieldCheck className="h-4 w-4 text-teal" /> What to expect
                    </h3>
                    <ul className="mt-3 space-y-2 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        A 15–20 minute call with an experienced counsellor
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        Personalised course recommendation based on your background
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        Clear information on batch schedules, mode and fee
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        No pressure to enroll — just honest guidance
                      </li>
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
