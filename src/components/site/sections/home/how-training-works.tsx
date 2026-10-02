import { Search, Compass, BookOpen, FlaskConical, FileText, Send, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    description: "Explore US Mortgage Underwriting and Australian Mortgage Operations. Speak with a counsellor to identify the right path for your goals.",
  },
  {
    icon: Compass,
    title: "Choose a Career Path",
    description: "Pick the program aligned with your interest — underwriting, loan processing, broker support or lending operations.",
  },
  {
    icon: BookOpen,
    title: "Learn",
    description: "Structured curriculum covering industry fundamentals, loan lifecycle, documentation, ratios and guideline awareness.",
  },
  {
    icon: FlaskConical,
    title: "Practice",
    description: "Case-study based practice on real-world-style loan files — decision scenarios, document review and ratio calculations.",
  },
  {
    icon: FileText,
    title: "Prepare",
    description: "Resume and LinkedIn guidance, role-specific interview preparation and mock interviews with feedback.",
  },
  {
    icon: Send,
    title: "Apply",
    description: "Receive relevant opportunities aligned with your training. Apply with confidence through our placement assistance.",
  },
  {
    icon: Rocket,
    title: "Build Your Career",
    description: "Start your role and continue to receive career support as you grow in the mortgage and lending industry.",
  },
];

export function HowTrainingWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How Training Works"
          title="From discovery to a built career"
          description="A clear, structured journey that takes you from exploring mortgage operations to applying for roles with confidence."
        />

        <div className="relative mt-12">
          {/* Vertical line for desktop */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-teal/0 via-teal/30 to-teal/0 lg:block"
            aria-hidden
          />

          <ol className="space-y-6 lg:space-y-0">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={step.title}
                  className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12"
                >
                  {/* Connector dot for desktop */}
                  <div className="relative">
                    <Reveal
                      className={isLeft ? "lg:pr-12" : "lg:col-start-2 lg:pl-12"}
                      delay={i * 60}
                    >
                      <article className="relative rounded-2xl border border-slate-200 bg-white p-5 card-hover hover:border-teal/40 sm:p-6">
                        <div className="flex items-start gap-4">
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                            <step.icon className="h-5 w-5" aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-[0.7rem] font-bold uppercase tracking-[0.18em] text-teal">
                                Step {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <h3 className="mt-1 font-heading text-base font-bold text-navy">
                              {step.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Reveal>

                    {/* Center dot */}
                    <span
                      className="absolute left-1/2 top-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-teal shadow-[0_0_0_4px_rgba(14,158,142,0.15)] lg:block"
                      aria-hidden
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
