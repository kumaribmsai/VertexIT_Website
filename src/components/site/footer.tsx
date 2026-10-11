import Link from "next/link";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/site/logo";
import { NewsletterSignup } from "@/components/site/newsletter-signup";
import { Phone, MessageCircle, MapPin, Clock, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";

async function getFooterData() {
  const [settings, courses] = await Promise.all([
    getSiteSettings(),
    db.course.findMany({
      where: { isPublished: true },
      select: { title: true, slug: true },
      orderBy: { displayOrder: "asc" },
      take: 6,
    }),
  ]);
  return { settings, courses };
}

export async function SiteFooter() {
  const { settings, courses } = await getFooterData();
  const waHref = await whatsappUrl("contact");
  const year = new Date().getFullYear();

  const socials: { url?: string | null; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { url: settings.linkedinUrl, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.instagramUrl, Icon: Instagram, label: "Instagram" },
    { url: settings.facebookUrl, Icon: Facebook, label: "Facebook" },
    { url: settings.youtubeUrl, Icon: Youtube, label: "YouTube" },
  ].filter((s): s is { url: string; Icon: any; label: string } => Boolean(s.url));

  return (
    <footer className="mt-auto bg-navy text-slate-300">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-7 sm:flex-row sm:items-center">
          <div>
            <p className="font-heading text-lg font-semibold text-white">Start your IT career with VertexIT</p>
            <p className="text-sm text-slate-400">Speak with a counsellor and find the right path for your goals.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-light"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
            <Link
              href="/apply"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-teal hover:text-teal-soft"
            >
              Talk to a Counsellor
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <Logo className="brightness-0 invert opacity-90 hover:opacity-100" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Career-focused professional training and placement assistance. Learn industry-focused skills, practice real workflows, and apply with confidence.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-soft" />
              <span>
                {settings.addressLine ? `${settings.addressLine}, ` : ""}
                {settings.city}, {settings.state}, {settings.country}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-teal-soft" />
              <a href={`tel:${settings.phone}`} className="hover:text-white">
                {settings.phone}
              </a>
              <span className="text-slate-600">·</span>
              <MessageCircle className="h-4 w-4 shrink-0 text-teal-soft" />
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-teal-soft" />
              <span>{settings.businessHours}</span>
            </div>
          </div>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:border-teal hover:text-teal-soft"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Courses</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {courses.length === 0 && <li className="text-slate-500">Coming soon</li>}
            {courses.map((c) => (
              <li key={c.slug}>
                <Link href={`/courses/${c.slug}`} className="text-slate-400 transition-colors hover:text-teal-soft">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/courses" className="text-teal-soft hover:text-white">
                View all →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Career</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/placement-process" className="text-slate-400 hover:text-teal-soft">Placement Process</Link></li>
            <li><Link href="/jobs" className="text-slate-400 hover:text-teal-soft">Jobs</Link></li>
            <li><Link href="/success-stories" className="text-slate-400 hover:text-teal-soft">Success Stories</Link></li>
            <li><Link href="/trainers" className="text-slate-400 hover:text-teal-soft">Trainers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Resources</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/blog" className="text-slate-400 hover:text-teal-soft">Blog</Link></li>
            <li><Link href="/resources" className="text-slate-400 hover:text-teal-soft">Free Guides</Link></li>
            <li><Link href="/faq" className="text-slate-400 hover:text-teal-soft">FAQ</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-teal-soft">About</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-teal-soft">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/apply" className="text-slate-400 hover:text-teal-soft">Apply / Enquire</Link></li>
            <li><Link href="/refer" className="text-slate-400 hover:text-teal-soft">Refer a Friend</Link></li>
            <li><Link href="/privacy-policy" className="text-slate-400 hover:text-teal-soft">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="text-slate-400 hover:text-teal-soft">Terms</Link></li>
            <li><Link href="/disclaimer" className="text-slate-400 hover:text-teal-soft">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-t border-white/10 bg-navy-light/50">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <NewsletterSignup source="footer" variant="inline" className="max-w-md mx-auto [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-slate-400" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {settings.brandName}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-1 rounded-full bg-teal" />
            {settings.brandName} · {settings.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
