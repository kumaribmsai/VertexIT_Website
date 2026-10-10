import type { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Building2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { LeadForm } from "@/components/site/lead-form";
import { getPublishedCourses } from "@/services/public";
import { getSiteSettings } from "@/lib/site";
import { whatsappUrl, normalizeWhatsappNumber } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Contact VertexIT | IT Training Bengaluru",
  description:
    "Contact VertexIT for IT training and placement assistance in Bengaluru. Phone, WhatsApp, business hours and enquiry form.",
  path: "/contact",
});

type Course = Awaited<ReturnType<typeof getPublishedCourses>>[number];

export default async function ContactPage() {
  const [courses, settings, waHref] = await Promise.all([
    getPublishedCourses(),
    getSiteSettings(),
    whatsappUrl("contact"),
  ]);

  const courseOptions = courses.map((c: Course) => ({ id: c.id, title: c.title }));

  const waNumber = normalizeWhatsappNumber(settings.whatsapp);
  const phoneDisplay = settings.phone;
  const phoneHref = `tel:${settings.phone}`;

  const socials: { url: string; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [];
  if (settings.linkedinUrl) socials.push({ url: settings.linkedinUrl, Icon: Linkedin, label: "LinkedIn" });
  if (settings.instagramUrl) socials.push({ url: settings.instagramUrl, Icon: Instagram, label: "Instagram" });
  if (settings.facebookUrl) socials.push({ url: settings.facebookUrl, Icon: Facebook, label: "Facebook" });
  if (settings.youtubeUrl) socials.push({ url: settings.youtubeUrl, Icon: Youtube, label: "YouTube" });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Get in touch
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Talk to the VertexIT team
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              Have a question about a course, eligibility, schedule or placement assistance? Send us
              a message and a counsellor will get back to you — usually within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            {/* Left: contact info */}
            <Reveal>
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Contact details"
                  title="Reach us directly"
                  description="Prefer to call or message? Use any of the channels below — we are happy to help."
                />

                <div className="mt-8 space-y-4">
                  {/* Phone */}
                  <a
                    href={phoneHref}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 card-hover"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Phone
                      </p>
                      <p className="font-heading text-lg font-bold text-navy group-hover:text-teal transition-colors">
                        {phoneDisplay}
                      </p>
                      <p className="text-xs text-slate-500">Tap to call</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 card-hover"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        WhatsApp
                      </p>
                      <p className="font-heading text-lg font-bold text-navy group-hover:text-teal transition-colors">
                        +{waNumber}
                      </p>
                      <p className="text-xs text-slate-500">Tap to chat — usually fastest</p>
                    </div>
                  </a>

                  {/* Email — only if configured */}
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}`}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 card-hover"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Email
                        </p>
                        <p className="font-heading text-lg font-bold text-navy group-hover:text-teal transition-colors">
                          {settings.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {/* Location */}
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Location
                      </p>
                      <p className="font-heading text-base font-bold text-navy">
                        {settings.city}, {settings.state}
                      </p>
                      <p className="text-sm text-slate-600">
                        {settings.country}
                      </p>
                      {settings.addressLine && (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                          <Building2 className="h-3 w-3" /> {settings.addressLine}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Business hours */}
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Business hours
                      </p>
                      <p className="font-heading text-base font-bold text-navy">
                        {settings.businessHours}
                      </p>
                      <p className="text-xs text-slate-500">Monday to Saturday</p>
                    </div>
                  </div>
                </div>

                {/* Socials */}
                {socials.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Follow us
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {socials.map(({ url, Icon, label }) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy transition-colors hover:border-teal hover:text-teal"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map */}
                <div className="mt-8">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Find us on the map
                  </p>
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                    {settings.mapEmbedUrl ? (
                      <iframe
                        title="VertexIT location"
                        src={settings.mapEmbedUrl}
                        className="h-64 w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="relative flex h-64 flex-col items-center justify-center overflow-hidden bg-slate-50 text-center">
                        {/* Decorative grid pattern */}
                        <div
                          className="absolute inset-0 opacity-50"
                          style={{
                            backgroundImage: "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                          }}
                          aria-hidden
                        />
                        {/* Map pin pulse */}
                        <div className="relative">
                          <span className="absolute -inset-4 animate-ping rounded-full bg-teal/20" aria-hidden />
                          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-lg">
                            <MapPin className="h-7 w-7" />
                          </span>
                        </div>
                        <p className="relative mt-4 font-heading text-sm font-bold text-navy">
                          {settings.city}, {settings.state}
                        </p>
                        <p className="relative mt-1 text-xs text-muted-foreground">
                          {settings.addressLine ? `${settings.addressLine}, ` : ""}
                          {settings.city}, {settings.state}, {settings.country}
                        </p>
                        <p className="relative mt-3 text-[0.7rem] text-slate-400">
                          Map embed will appear here once configured in Site Settings
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: LeadForm */}
            <Reveal delay={120}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in the form and a counsellor will get back to you shortly.
                </p>
                <div className="mt-6">
                  <LeadForm courses={courseOptions} source="contact" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
