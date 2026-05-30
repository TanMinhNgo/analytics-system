"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "@/components/ui/Card";
import type { SourceBreakdown } from "@/types/analytics";

const COLORS = ["#ff7a48", "#2dd4bf", "#60a5fa", "#f59e0b"];

export function SourcePieChart({ data }: { data: SourceBreakdown[] }) {
  return (
    <Card className="h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Records by Source</h3>
        <p className="text-sm text-muted-foreground">Current mix</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={50} outerRadius={90}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#10131a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
