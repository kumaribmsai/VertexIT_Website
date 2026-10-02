import { computeLeadScore, getScoreBreakdown, getScoreTone, getScoreLabel, type LeadForScoring } from "@/lib/lead-scoring";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function LeadScoreBreakdown({ lead }: { lead: LeadForScoring }) {
  const score = computeLeadScore(lead);
  const breakdown = getScoreBreakdown(lead);
  const tone = getScoreTone(score);
  const label = getScoreLabel(score);

  const toneStyles = {
    hot: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", icon: Flame, bar: "bg-red-500" },
    warm: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", icon: TrendingUp, bar: "bg-amber-500" },
    cold: { bg: "bg-slate-50", text: "text-slate-600", ring: "ring-slate-200", icon: Minus, bar: "bg-slate-400" },
  }[tone];

  const Icon = toneStyles.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold text-navy">Lead Score</h2>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${toneStyles.bg} ${toneStyles.text} ring-1 ${toneStyles.ring}`}>
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
      </div>

      {/* Score gauge */}
      <div className="mb-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-heading text-4xl font-extrabold text-navy">{score}</p>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500">Priority</p>
            <p className={`text-sm font-bold ${toneStyles.text}`}>
              {tone === "hot" ? "Follow up now" : tone === "warm" ? "Follow up soon" : "Low priority"}
            </p>
          </div>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${toneStyles.bar} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score breakdown</p>
        {breakdown.map((c) => (
          <div key={c.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-navy">{c.label}</span>
              <span className={`font-bold ${c.value > 0 ? "text-teal" : "text-slate-400"}`}>
                +{c.value}<span className="text-slate-300">/{c.max}</span>
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${c.value > 0 ? "bg-teal" : "bg-slate-200"}`}
                  style={{ width: `${(c.value / c.max) * 100}%` }}
                />
              </div>
              <span className="w-32 shrink-0 text-right text-[0.7rem] text-muted-foreground">{c.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NextActionCard({
  action,
  reason,
  priority,
}: {
  action: string;
  reason: string;
  priority: "high" | "medium" | "low";
}) {
  const priorityStyles = {
    high: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "🔥", label: "High priority" },
    medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "⏰", label: "Medium priority" },
    low: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", icon: "📌", label: "Low priority" },
  }[priority];

  return (
    <div className={`rounded-xl border ${priorityStyles.border} ${priorityStyles.bg} p-5`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{priorityStyles.icon}</span>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Recommended next action
          </p>
          <p className={`font-heading text-sm font-bold ${priorityStyles.text}`}>{action}</p>
        </div>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${priorityStyles.bg} ${priorityStyles.text}`}>
          {priorityStyles.label}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{reason}</p>
    </div>
  );
}
