import { Globe, FlaskConical, Building2, Briefcase, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const ITEMS = [
  { icon: Globe, label: "Hybrid Training" },
  { icon: FlaskConical, label: "Practical Learning" },
  { icon: Building2, label: "Industry-Focused Curriculum" },
  { icon: Briefcase, label: "Placement Assistance" },
  { icon: HeartHandshake, label: "Career Support" },
];

// Horizontal trust strip — clean, no fake numbers.
export function TrustStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Reveal>
          <ul className="flex flex-col items-stretch divide-y divide-slate-200 sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
            {ITEMS.map((item) => (
              <li
                key={item.label}
                className="flex flex-1 items-center justify-center gap-2.5 px-4 py-3 sm:py-2"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
                  <item.icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="font-heading text-[0.82rem] font-semibold tracking-tight text-navy">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
