"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type LeadTrendPoint = { date: string; label: string; count: number };

export function LeadTrendChart({ data }: { data: LeadTrendPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0E9E8E" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0E9E8E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
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
            formatter={(value: number) => [`${value} leads`, "Enquiries"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0E9E8E"
            strokeWidth={2.5}
            fill="url(#leadGradient)"
            dot={{ r: 3, fill: "#0E9E8E", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#0E9E8E", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
