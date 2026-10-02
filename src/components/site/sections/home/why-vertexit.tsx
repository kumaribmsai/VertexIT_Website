import {
  FlaskConical,
  Building2,
  Briefcase,
  Handshake,
  MonitorSmartphone,
  Compass,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const REASONS = [
  {
    icon: FlaskConical,
    title: "Practical Learning",
    description:
      "Case-study based practice on real-world loan files, ratio calculations, documentation review and decision scenarios — not just theory.",
  },
  {
    icon: Building2,
    title: "Industry-Oriented Curriculum",
    description:
      "Curriculum built around the actual mortgage workflow — US underwriting and Australian operations — designed to mirror what hiring teams expect.",
  },
  {
    icon: Briefcase,
    title: "Career Preparation",
    description:
      "Resume guidance, mock interviews and role-specific preparation built into the program, so you walk in confident and prepared.",
  },
  {
    icon: Handshake,
    title: "Placement Assistance",
    description:
      "Placement assistance with a very high placement rate — resume guidance, interview preparation and relevant opportunities throughout your job-search.",
  },
  {
    icon: MonitorSmartphone,
    title: "Hybrid Learning",
    description:
      "A flexible blend of live online sessions with in-person practice where applicable, designed for graduates, working professionals and outstation candidates.",
  },
  {
    icon: Compass,
    title: "Career-Focused Mentorship",
    description:
      "Mentorship oriented towards building a long-term mortgage career — not just clearing a single interview — guided by experienced trainers.",
  },
];

export function WhyVertexit() {
  return (
    <section className="bg-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why VertexIT"
          title="Built for a career, not just a certificate"
          description="Our programs are structured around what hiring teams in mortgage and lending operations actually look for — practical skills, real workflows and end-to-end career preparation."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <article className="group relative h-full rounded-2xl border border-slate-200 bg-white p-6 card-hover hover:border-teal/40">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white">
                  <r.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-navy">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
