import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/primitives";
import { CourseForm, type CourseFormInitial } from "@/components/admin/course-form";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: { sortOrder: "asc" } },
      outcomes: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!course) notFound();

  const initial: CourseFormInitial = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription,
    introduction: course.introduction,
    whoFor: course.whoFor,
    whatYouLearn: course.whatYouLearn,
    practicalLearning: course.practicalLearning,
    caseStudies: course.caseStudies,
    careerRoles: course.careerRoles,
    placementAssistance: course.placementAssistance,
    trainingMode: course.trainingMode,
    eligibility: course.eligibility,
    keySkills: course.keySkills,
    careerPathways: course.careerPathways,
    duration: course.duration,
    batchSchedule: course.batchSchedule,
    courseFee: course.courseFee,
    status: course.status,
    featuredImage: course.featuredImage,
    metaTitle: course.metaTitle,
    metaDescription: course.metaDescription,
    canonicalUrl: course.canonicalUrl,
    ogTitle: course.ogTitle,
    ogDescription: course.ogDescription,
    ogImage: course.ogImage,
    isPublished: course.isPublished,
    isDemo: course.isDemo,
    displayOrder: course.displayOrder,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
    })),
    outcomes: course.outcomes.map((o) => ({ id: o.id, text: o.text })),
    faqs: course.faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    })),
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Course"
        description={course.title}
        backHref="/admin/courses"
      />
      <CourseForm initial={initial} />
    </div>
  );
}
