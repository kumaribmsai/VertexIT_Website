"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

export type FunnelStage = {
  stage: string;
  label: string;
  count: number;
  color: string;
};

export function LeadFunnelChart({ data }: { data: FunnelStage[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: "#0B2545", fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0B2545",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#94A3B8", marginBottom: 4 }}
            itemStyle={{ color: "#fff" }}
            formatter={(value: number, _name, props) => {
              const pct = maxCount > 0 ? Math.round((value / maxCount) * 100) : 0;
              return [`${value} leads (${pct}% of top)`, props.payload.stage];
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
            {data.map((entry) => (
              <Cell key={entry.stage} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
