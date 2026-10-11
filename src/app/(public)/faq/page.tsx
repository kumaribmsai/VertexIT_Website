import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/state";
import { JsonLd } from "@/components/site/json-ld";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { getPublishedFaqs } from "@/services/public";
import { whatsappUrl } from "@/lib/whatsapp";
import { faqPageJsonLd, buildPageMetadata } from "@/lib/seo";
import { MessageCircle, Phone, HelpCircle } from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "FAQ | VertexIT Career Training",
  description:
    "Answers to frequently asked questions about VertexIT Career Training, placement assistance, eligibility, course fees and more.",
  path: "/faq",
});

type Faq = Awaited<ReturnType<typeof getPublishedFaqs>>[number];

export default async function FaqPage() {
  const [faqs, waHref] = await Promise.all([
    getPublishedFaqs(),
    whatsappUrl("contact"),
  ]);

  // Group by category, preserving first-seen order
  const grouped: { category: string; items: Faq[] }[] = [];
  for (const faq of faqs) {
    const cat = faq.category || "General";
    let bucket = grouped.find((g) => g.category === cat);
    if (!bucket) {
      bucket = { category: cat, items: [] };
      grouped.push(bucket);
    }
    bucket.items.push(faq);
  }

  // JSON-LD for all FAQs
  const jsonLd =
    faqs.length > 0
      ? faqPageJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))
      : null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Questions
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              Common questions about our career training programs, eligibility, fees and
              placement assistance. If something is not covered here, please speak with a
              VertexIT counsellor.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ body */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
            {/* Main column */}
            <div>
              {faqs.length === 0 ? (
                <EmptyState
                  title="FAQs will be published here soon"
                  description="We are preparing answers to common questions about our career training programs and placement assistance. Meanwhile, please speak with a counsellor for current eligibility details."
                  icon={HelpCircle}
                  action={<LinkButton href="/apply">Talk to a Counsellor</LinkButton>}
                />
              ) : (
                <div className="space-y-12">
                  {grouped.map((group, gi) => (
                    <Reveal key={group.category} delay={gi * 80}>
                      <section aria-labelledby={`faq-cat-${gi}`}>
                        <h2
                          id={`faq-cat-${gi}`}
                          className="font-heading text-xl font-bold text-navy sm:text-2xl"
                        >
                          {group.category}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {group.items.length}{" "}
                          {group.items.length === 1 ? "question" : "questions"}
                        </p>
                        <Accordion type="single" collapsible className="mt-5" defaultValue={group.items[0]?.id}>
                          {group.items.map((faq) => (
                            <AccordionItem
                              key={faq.id}
                              value={faq.id}
                              className="rounded-xl border border-slate-200 bg-white px-5 mb-3 last:mb-0"
                            >
                              <AccordionTrigger className="text-left font-heading text-[0.95rem] font-semibold text-navy hover:no-underline">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm leading-relaxed text-slate-600">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </section>
                    </Reveal>
                  ))}
                </div>
              )}

              {/* Eligibility note */}
              <div className="mt-12 rounded-2xl border border-teal/20 bg-teal/5 p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-slate-700">
                  <strong className="text-navy">Need current eligibility details?</strong> Where
                  specific eligibility is not listed, please speak with a VertexIT counsellor for
                  current eligibility details — they will guide you based on your background and
                  goals.
                </p>
              </div>
            </div>

            {/* Side CTA card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 font-heading text-lg font-bold text-navy">
                    Still have questions? Talk to a counsellor
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Our team will help you with eligibility, course details, fees, schedule and
                    placement assistance — clearly and honestly.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <WhatsAppButton href={waHref} className="w-full">
                      WhatsApp Us
                    </WhatsAppButton>
                    <LinkButton href="/contact" variant="outline" className="w-full">
                      <Phone className="h-4 w-4" /> Call / Contact
                    </LinkButton>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Or{" "}
                    <Link href="/apply" className="font-semibold text-teal hover:text-teal/80">
                      apply now
                    </Link>{" "}
                    and we will reach out to you.
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* JSON-LD structured data */}
      {jsonLd && <JsonLd data={jsonLd} />}
    </>
  );
}
