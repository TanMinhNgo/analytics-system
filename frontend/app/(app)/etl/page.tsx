"use client";

import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { apiClient } from "@/lib/api/client";
import { useEtlJobStream } from "@/lib/hooks/useEtlJobStream";
import { useEtlJobs } from "@/lib/api/hooks";
import { etlLogs } from "@/lib/mock-data";
import { formatDateTime, formatDuration, formatNumber } from "@/lib/utils/format";

const steps = ["SELECT", "EXTRACT", "TRANSFORM", "INTEGRATE", "LOAD"];

export default function EtlPage() {
  const jobsQuery = useEtlJobs();
  const [tab, setTab] = useState<"all" | "running" | "queued" | "success" | "failed">("all");
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);

  const jobs = useMemo(() => {
    if (tab === "all") return jobsQuery.data;
    return jobsQuery.data.filter((job) => job.status === tab);
  }, [jobsQuery.data, tab]);
  const jobStats = useMemo(
    () => ({
      running: jobsQuery.data.filter((job) => job.status === "running").length,
      queued: jobsQuery.data.filter((job) => job.status === "queued").length,
      success: jobsQuery.data.filter((job) => job.status === "success").length,
      failed: jobsQuery.data.filter((job) => job.status === "failed").length,
    }),
    [jobsQuery.data]
  );
  const activeJobId = selectedJobId ?? jobsQuery.data.find((item) => item.status === "running")?.id;
  const stream = useEtlJobStream(activeJobId);
  const displayLogs = stream.logs.length > 0 ? stream.logs : etlLogs;

  async function triggerRun() {
    try {
      await apiClient("/api/v1/etl/run", { method: "POST" });
      toast.success("ETL run triggered successfully.");
    } catch {
      toast.error("Failed to trigger ETL run.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="ETL Pipeline Monitor"
          subtitle="Track ingestion jobs, queues, and execution stages."
        />
        <Button onClick={triggerRun}>Trigger ETL run</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {[
          { label: "Active", value: jobStats.running, icon: Activity },
          { label: "Queued", value: jobStats.queued, icon: Clock },
          { label: "Success", value: jobStats.success, icon: CheckCircle2 },
          { label: "Failed", value: jobStats.failed, icon: XCircle },
        ].map((item) => (
          <Card key={item.label} className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {item.label}
              <item.icon size={16} />
            </div>
            <div className="text-3xl font-semibold text-foreground">{item.value}</div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHeader title="Pipeline Stages" subtitle="Latest ERP sync" />
        <div className="mt-6 grid gap-4 sm:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-border bg-card/60 px-4 py-5 text-sm"
            >
              <div className="text-muted-foreground">Step {index + 1}</div>
              <div className="mt-2 text-lg font-semibold text-foreground">{step}</div>
              <div className="mt-2 text-xs text-emerald-200">Completed</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHeader title="Recent Jobs" />
        <div className="mb-4 flex flex-wrap gap-2">
          {["all", "running", "queued", "success", "failed"].map((value) => (
            <Button
              key={value}
              size="sm"
              variant={tab === value ? "primary" : "outline"}
              onClick={() => setTab(value as typeof tab)}
            >
              {value.toUpperCase()}
            </Button>
          ))}
        </div>
        {jobs.length === 0 ? (
          <EmptyState
            title="No ETL jobs in this tab"
            description="Try a different status filter."
          />
        ) : null}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Job</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Duration</TableHeaderCell>
              <TableHeaderCell>Rows</TableHeaderCell>
              <TableHeaderCell>Started</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {jobs.map((job) => (
              <TableRow
                key={job.id}
                className={activeJobId === job.id ? "bg-muted/50" : ""}
                onClick={() => setSelectedJobId(job.id)}
              >
                <TableCell className="font-medium text-foreground">{job.name}</TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell>{formatDuration(job.durationMs)}</TableCell>
                <TableCell>{formatNumber(job.rowsProcessed)}</TableCell>
                <TableCell>{formatDateTime(job.startedAt)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
      <Card>
        <SectionHeader
          title="Live Job Logs"
          subtitle={
            stream.error
              ? stream.error
              : stream.connected
                ? `Streaming for ${activeJobId ?? "selected job"}`
                : "Showing latest available logs"
          }
        />
        <div className="mt-4 space-y-3 text-sm text-foreground/85">
          {displayLogs.map((log, index) => (
            <div key={`${log.timestamp}-${index}`} className="flex gap-3">
              <span className="text-muted-foreground">{log.timestamp}</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
