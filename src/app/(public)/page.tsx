import { HomeHero } from "@/components/site/sections/home/hero";
import { TrustStrip } from "@/components/site/sections/home/trust-strip";
import { WhyVertexit } from "@/components/site/sections/home/why-vertexit";
import { StatsSection } from "@/components/site/sections/home/stats-section";
import { HomeCourses } from "@/components/site/sections/home/courses-section";
import { CurriculumPreview } from "@/components/site/sections/home/curriculum-preview";
import { WhatYouLearn } from "@/components/site/sections/home/what-you-learn";
import { CourseComparison } from "@/components/site/sections/home/course-comparison";
import { HowTrainingWorks } from "@/components/site/sections/home/how-training-works";
import { PlacementJourney } from "@/components/site/sections/home/placement-journey";
import { CareerPathways } from "@/components/site/sections/home/career-pathways";
import { WhyBengaluru } from "@/components/site/sections/home/why-bengaluru";
import { HomeJobs } from "@/components/site/sections/home/jobs-section";
import { SuccessStories } from "@/components/site/sections/home/success-stories";
import { HomeTrainers } from "@/components/site/sections/home/trainers-section";
import { HomeFaq } from "@/components/site/sections/home/faq-section";
import { FinalCta } from "@/components/site/sections/home/final-cta";
import { JsonLd } from "@/components/site/json-ld";
import { getSiteSettings } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";

// Re-validate every 60s — ISR for content updates from CMS.
export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSiteSettings();
  const orgJsonLd = organizationJsonLd(settings);

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <HomeHero settings={settings} />
      <TrustStrip />
      <WhyVertexit />
      <StatsSection />
      <HomeCourses />
      <CurriculumPreview />
      <WhatYouLearn />
      <CourseComparison />
      <HowTrainingWorks />
      <PlacementJourney />
      <CareerPathways />
      <WhyBengaluru />
      {/* These three sections collapse (return null) when there is no published content,
          so the homepage never looks incomplete with empty states. */}
      <HomeJobs />
      <SuccessStories />
      <HomeTrainers />
      <HomeFaq />
      <FinalCta settings={settings} />
    </>
  );
}
