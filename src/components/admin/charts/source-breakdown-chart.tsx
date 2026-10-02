"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type SourcePoint = { name: string; value: number; color: string };

export function SourceBreakdownChart({ data, total }: { data: SourcePoint[]; total: number }) {
  const hasData = data.length > 0 && total > 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={hasData ? data : [{ name: "No data", value: 1, color: "#E2E8F0" }]}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {(hasData ? data : [{ name: "No data", value: 1, color: "#E2E8F0" }]).map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B2545",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value: number, name: string) => [`${value} leads`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-2xl font-bold text-navy">{total}</span>
          <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {hasData ? (
          data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600">{d.name}</span>
              </span>
              <span className="font-semibold text-navy">
                {d.value} {total > 0 && `(${Math.round((d.value / total) * 100)}%)`}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No leads yet.</p>
        )}
      </div>
    </div>
  );
}
