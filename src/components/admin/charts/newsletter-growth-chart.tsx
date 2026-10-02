"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type GrowthPoint = { date: string; label: string; total: number; newSignups: number };

export function NewsletterGrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0B2545" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0B2545" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
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
            formatter={(value: number, name: string) => [
              `${value} ${name === "total" ? "subscribers" : "new signups"}`,
              name === "total" ? "Total" : "New",
            ]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#0B2545"
            strokeWidth={2.5}
            fill="url(#totalGradient)"
            dot={{ r: 3, fill: "#0B2545", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#0B2545", stroke: "#fff", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="newSignups"
            stroke="#0E9E8E"
            strokeWidth={2}
            fill="url(#newGradient)"
            dot={{ r: 2, fill: "#0E9E8E", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
