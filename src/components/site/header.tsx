import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { WhatsAppButton } from "@/components/site/buttons";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Placement", href: "/placement-process" },
  { label: "Jobs", href: "/jobs" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

async function getPublishedCourseCount() {
  try {
    return await db.course.count({ where: { isPublished: true } });
  } catch {
    return 0;
  }
}

async function getPublishedJobCount() {
  try {
    return await db.job.count({ where: { isPublished: true, isExpired: false } });
  } catch {
    return 0;
  }
}

export async function SiteHeader() {
  const [settings, courseCount, jobCount] = await Promise.all([
    getSiteSettings(),
    getPublishedCourseCount(),
    getPublishedJobCount(),
  ]);
  const waHref = await whatsappUrl("home");

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility strip */}
      <div className="hidden bg-navy text-white/90 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <p className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
            Hybrid training in Bengaluru · {courseCount} live courses · {jobCount} open roles
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${settings.phone}`} className="hover:text-teal-soft transition-colors">
              Call {settings.phone}
            </a>
            <span className="text-white/20">|</span>
            <span>Business hours: {settings.businessHours}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div
        id="site-header-main"
        className="border-b border-slate-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[78px]">
          <Logo />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal/5 hover:text-teal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-teal/5 hover:text-teal"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            <WhatsAppButton href={waHref} size="sm" className="hidden sm:inline-flex" />
            <MobileNav nav={NAV} waHref={waHref} phone={settings.phone} />
          </div>
        </div>
      </div>
    </header>
  );
}
