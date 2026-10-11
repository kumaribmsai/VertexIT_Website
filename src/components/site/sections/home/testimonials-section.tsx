import { getPublishedTestimonials } from "@/services/public";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TestimonialsCarousel } from "@/components/site/testimonials-carousel";

export async function HomeTestimonials() {
  let testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>> = [];
  try {
    testimonials = await getPublishedTestimonials();
  } catch {
    /* graceful */
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-slate-50/60 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="What students say"
            title="Trusted by career aspirants"
            description="Honest feedback from candidates who chose VertexIT for their professional training journey."
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
