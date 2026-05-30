"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/Card";
import type { TimeseriesPoint } from "@/types/analytics";

export function TimeSeriesChart({ data }: { data: TimeseriesPoint[] }) {
  return (
    <Card className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Ingestion Volume</h3>
          <p className="text-sm text-muted-foreground">Hourly volume</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" stroke="#97a1b0" />
            <YAxis stroke="#97a1b0" />
            <Tooltip
              contentStyle={{
                background: "#10131a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#ff7a48" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
