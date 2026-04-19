"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeightLog } from "@/types";

interface WeightChartProps {
  logs: WeightLog[];
  unit: "kg" | "lbs";
}

export function WeightChart({ logs, unit }: WeightChartProps) {
  if (logs.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Add at least 2 weight entries to see the chart.
      </p>
    );
  }

  const data = logs
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: log.weight,
    }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, "Weight"]}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              fontSize: "0.75rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="oklch(0.55 0.22 285)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "oklch(0.55 0.22 285)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
