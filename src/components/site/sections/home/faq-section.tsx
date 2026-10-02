import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { getPublishedFaqs } from "@/services/public";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/state";
import { WhatsAppButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";
import { JsonLd } from "@/components/site/json-ld";
import { faqPageJsonLd } from "@/lib/seo";

type Faq = Awaited<ReturnType<typeof getPublishedFaqs>>[number];

export async function HomeFaq() {
  let faqs: Faq[] = [];
  let waHref = "#";
  try {
    [faqs, waHref] = await Promise.all([
      getPublishedFaqs(),
      whatsappUrl("generic"),
    ]);
  } catch {
    /* graceful */
  }

  return (
    <section className="bg-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left — heading & CTA */}
          <div className="lg:col-span-4">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know about our programs, training mode, eligibility and placement assistance. Still curious? Reach out on WhatsApp."
            />
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-navy">Still have questions?</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Speak with a VertexIT counsellor for personal guidance on courses, batches and placement.
              </p>
              <div className="mt-4">
                <WhatsAppButton href={waHref} size="sm">
                  WhatsApp a counsellor
                </WhatsAppButton>
              </div>
            </div>
            <Link
              href="/faq"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80"
            >
              View all FAQs
              <MessageCircle className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-8">
            {faqs.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="FAQs are being finalised"
                description="We will publish answers to common questions shortly. In the meantime, please reach out to us on WhatsApp."
              />
            ) : (
              <Reveal>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <Accordion type="single" collapsible defaultValue={faqs[0]?.id} className="px-5">
                    {faqs.map((f) => (
                      <AccordionItem key={f.id} value={f.id}>
                        <AccordionTrigger className="text-left font-heading text-[0.95rem] font-semibold text-navy hover:no-underline hover:text-teal">
                          {f.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* FAQ structured data for SEO */}
      {faqs.length > 0 && (
        <JsonLd
          data={faqPageJsonLd(
            faqs.map((f) => ({ question: f.question, answer: f.answer })),
          )}
        />
      )}
    </section>
  );
}
