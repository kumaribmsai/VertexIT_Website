import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { MapPin, Building2, Plane, Users, Wifi } from "lucide-react";

// Local SEO section — establishes Bengaluru relevance without fabricating
// fake location pages. Uses qualitative, factual statements only.
const REASONS = [
  {
    icon: Building2,
    title: "India's operations & GCC hub",
    description: "Bengaluru is home to leading global capability centres and multinational teams that actively hire trained professionals.",
  },
  {
    icon: Users,
    title: "Active hiring ecosystem",
    description: "The city's mix of global enterprises, financial institutions and leading operations firms creates consistent demand for trained candidates.",
  },
  {
    icon: Wifi,
    title: "Hybrid & remote-friendly",
    description: "Many professional operations roles in Bengaluru support hybrid or remote work — giving you flexibility as you build your career.",
  },
  {
    icon: Plane,
    title: "Global process careers",
    description: "Global operations roles based in Bengaluru offer direct exposure to international business workflows and industry standards.",
  },
];

export function WhyBengaluru() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left — copy + map pin visual */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Bengaluru · Karnataka · India
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl text-balance">
                Why Bengaluru is the right place to launch your career
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
                VertexIT is based in Bengaluru — one of India's strongest markets for global operations and industry careers. Our training is designed around the skills that hiring teams in this city actually look for.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-navy">VertexIT Bengaluru</p>
                  <p className="text-xs text-muted-foreground">GB Play · 9:00 AM – 8:00 PM</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — reasons grid */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {REASONS.map((r, i) => (
                <Reveal key={r.title} delay={i * 80}>
                  <article className="group h-full rounded-2xl border border-slate-200 bg-white p-5 card-hover hover:border-teal/40">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal transition-transform group-hover:scale-105">
                      <r.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-heading text-base font-bold text-navy">{r.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
