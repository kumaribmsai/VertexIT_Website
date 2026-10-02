import { cn } from "@/lib/utils";

const LEAD_STATUSES: Record<string, { label: string; tone: string }> = {
  NEW: { label: "New", tone: "bg-blue-100 text-blue-700 border-blue-200" },
  CONTACTED: { label: "Contacted", tone: "bg-amber-100 text-amber-700 border-amber-200" },
  "COUNSELLING SCHEDULED": { label: "Counselling Scheduled", tone: "bg-purple-100 text-purple-700 border-purple-200" },
  "COUNSELLING COMPLETED": { label: "Counselling Done", tone: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "DEMO SCHEDULED": { label: "Demo Scheduled", tone: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  "DEMO COMPLETED": { label: "Demo Done", tone: "bg-teal-100 text-teal-700 border-teal-200" },
  INTERESTED: { label: "Interested", tone: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  "FOLLOW-UP REQUIRED": { label: "Follow-up", tone: "bg-orange-100 text-orange-700 border-orange-200" },
  ENROLLED: { label: "Enrolled", tone: "bg-green-100 text-green-700 border-green-200" },
  TRAINING: { label: "Training", tone: "bg-sky-100 text-sky-700 border-sky-200" },
  "PLACEMENT SUPPORT": { label: "Placement Support", tone: "bg-violet-100 text-violet-700 border-violet-200" },
  "INTERVIEW SCHEDULED": { label: "Interview", tone: "bg-pink-100 text-pink-700 border-pink-200" },
  PLACED: { label: "Placed", tone: "bg-green-600 text-white border-green-600" },
  "NOT INTERESTED": { label: "Not Interested", tone: "bg-slate-200 text-slate-700 border-slate-300" },
  "NOT ELIGIBLE": { label: "Not Eligible", tone: "bg-red-100 text-red-700 border-red-200" },
  CLOSED: { label: "Closed", tone: "bg-slate-100 text-slate-500 border-slate-200" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const cfg = LEAD_STATUSES[status] ?? { label: status, tone: "bg-slate-100 text-slate-600 border-slate-200" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold",
        cfg.tone,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

export const LEAD_STATUS_OPTIONS = Object.keys(LEAD_STATUSES);
