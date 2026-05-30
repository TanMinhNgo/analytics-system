"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { useDataMarts, useTimeseries } from "@/lib/api/hooks";
import { formatNumber } from "@/lib/utils/format";

export default function ReportsPage() {
  const martsQuery = useDataMarts();
  const timeseriesQuery = useTimeseries();
  const [selectedMart, setSelectedMart] = useState("");
  const [granularity, setGranularity] = useState("daily");
  const [view, setView] = useState<"line" | "table">("line");

  const selected = useMemo(() => {
    if (!selectedMart) return martsQuery.data[0];
    return martsQuery.data.find((item) => item.name === selectedMart) ?? martsQuery.data[0];
  }, [martsQuery.data, selectedMart]);

  function exportCsv() {
    const header = "time,records";
    const body = timeseriesQuery.data.map((point) => `${point.label},${point.value}`).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${selected?.name ?? "analytics"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Reports" subtitle="Build, preview, and export analytical reports." />
      <Card className="space-y-6">
        <SectionHeader title="Report Builder" />
        <div className="grid gap-4 md:grid-cols-3">
          <Select value={selected?.name ?? ""} onChange={(e) => setSelectedMart(e.target.value)}>
            {martsQuery.data.map((mart) => (
              <option key={mart.name} value={mart.name}>
                {mart.name}
              </option>
            ))}
          </Select>
          <Select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </Select>
          <Select value={view} onChange={(e) => setView(e.target.value as "line" | "table")}>
            <option value="line">Line chart</option>
            <option value="table">Table</option>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Button>Run report</Button>
          <Button variant="outline" onClick={exportCsv}>
            <Download size={14} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionHeader
          title={selected?.name ?? "Result"}
          subtitle={`${selected?.description ?? "No description"} • ${granularity}`}
        />
        {timeseriesQuery.data.length === 0 ? (
          <EmptyState title="No report data" description="Try another data mart or time range." />
        ) : null}
        {view === "line" ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseriesQuery.data}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#a7b0be", fontSize: 12 }} />
                <YAxis tick={{ fill: "#a7b0be", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#12141a",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff7a48"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Timestamp</TableHeaderCell>
                <TableHeaderCell>Records</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {timeseriesQuery.data.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                  <TableCell>{formatNumber(row.value)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
