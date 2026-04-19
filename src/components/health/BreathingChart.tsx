"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import type { BreathingLog } from "@/types";

const NORMAL_MIN = 20;
const NORMAL_MAX = 30;

interface BreathingChartProps {
  logs: BreathingLog[];
}

export function BreathingChart({ logs }: BreathingChartProps) {
  if (logs.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Add at least 2 entries to see the chart.
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
      bpm: log.breathsPerMinute,
    }));

  return (
    <div className="space-y-1">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            {/* Normal range band */}
            <ReferenceArea
              y1={NORMAL_MIN}
              y2={NORMAL_MAX}
              fill="oklch(0.75 0.15 145)"
              fillOpacity={0.15}
            />
            <ReferenceLine
              y={NORMAL_MIN}
              stroke="oklch(0.55 0.18 145)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <ReferenceLine
              y={NORMAL_MAX}
              stroke="oklch(0.55 0.18 145)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
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
              formatter={(value) => [`${value} bpm`, "Breathing rate"]}
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                fontSize: "0.75rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="oklch(0.55 0.22 285)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "oklch(0.55 0.22 285)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Green band = normal resting range ({NORMAL_MIN}–{NORMAL_MAX} bpm)
      </p>
    </div>
  );
}
