import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Plus, GraduationCap, CheckCircle2, CircleDashed } from "lucide-react";

import { AdminPageHeader, AdminCard, AdminEmpty, AdminBadge } from "@/components/admin/primitives";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AdminCourseActions } from "@/components/admin/course-actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "navy" | "teal" | "amber" | "slate"> = {
  ACTIVE: "teal",
  UPCOMING: "amber",
  ARCHIVED: "slate",
};

const MODE_LABEL: Record<string, string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  HYBRID: "Hybrid",
  LIVE: "Live",
  RECORDED: "Recorded",
};

export default async function AdminCoursesPage() {
  const [courses, publishedCount] = await Promise.all([
    db.course.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        trainingMode: true,
        status: true,
        isPublished: true,
        isDemo: true,
        displayOrder: true,
        createdAt: true,
        _count: { select: { modules: true } },
      },
    }),
    db.course.count({ where: { isPublished: true } }),
  ]);

  const draftCount = courses.length - publishedCount;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Courses"
        description="Create and manage VertexIT training programmes. Changes go live the moment you publish."
        actions={
          <Link
            href="/admin/courses/new"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--navy)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--navy-light)]"
          >
            <Plus className="h-4 w-4" />
            New Course
          </Link>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={<GraduationCap className="h-4 w-4" />}
          label="Total courses"
          value={courses.length}
          tone="navy"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Published"
          value={publishedCount}
          tone="teal"
        />
        <SummaryCard
          icon={<CircleDashed className="h-4 w-4" />}
          label="Drafts / unpublished"
          value={draftCount}
          tone="amber"
        />
      </div>

      {/* Course list */}
      <AdminCard>
        {courses.length === 0 ? (
          <AdminEmpty message="No courses yet. Click “New Course” to create your first programme." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                <TableHead className="pl-3 text-xs uppercase tracking-wide text-slate-500">Course</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-slate-500">Slug</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-slate-500">Mode</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-slate-500">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-slate-500">Published</TableHead>
                <TableHead className="text-center text-xs uppercase tracking-wide text-slate-500">Modules</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-slate-500">Created</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wide text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow
                  key={c.id}
                  className="group transition-colors hover:bg-slate-50/60"
                >
                  <TableCell className="py-3 pl-3">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="block max-w-xs"
                    >
                      <span className="font-heading text-sm font-semibold text-navy group-hover:text-teal">
                        {c.title}
                      </span>
                      {c.shortDescription && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {c.shortDescription}
                        </span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
                      /{c.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">
                      {MODE_LABEL[c.trainingMode] ?? c.trainingMode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AdminBadge tone={STATUS_TONE[c.status] ?? "slate"}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </AdminBadge>
                  </TableCell>
                  <TableCell>
                    {c.isPublished ? (
                      <AdminBadge tone="green">Published</AdminBadge>
                    ) : (
                      <AdminBadge tone="slate">Draft</AdminBadge>
                    )}
                    {c.isDemo && (
                      <span className="ml-1">
                        <AdminBadge tone="amber">Demo</AdminBadge>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                      {c._count.modules}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {format(new Date(c.createdAt), "d MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <AdminCourseActions
                      courseId={c.id}
                      title={c.title}
                      slug={c.slug}
                      published={c.isPublished}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AdminCard>
    </div>
  );
}

function SummaryCard({
  icon, label, value, tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "navy" | "teal" | "amber";
}) {
  const toneClasses: Record<string, string> = {
    navy: "bg-navy/10 text-navy",
    teal: "bg-teal/10 text-teal",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        {icon}
      </span>
      <div>
        <p className="font-heading text-2xl font-bold text-navy">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
