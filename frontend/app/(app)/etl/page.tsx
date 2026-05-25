"use client";

import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { useEtlJobs } from "@/lib/api/hooks";
import { etlLogs } from "@/lib/mock-data";
import { formatDateTime, formatDuration, formatNumber } from "@/lib/utils/format";

const steps = ["SELECT", "EXTRACT", "TRANSFORM", "INTEGRATE", "LOAD"];

export default function EtlPage() {
  const jobsQuery = useEtlJobs();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="ETL Pipeline Monitor"
          subtitle="Track ingestion jobs, queues, and execution stages."
        />
        <Button>Trigger ETL run</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {[
          { label: "Active", value: 3, icon: Activity },
          { label: "Queued", value: 6, icon: Clock },
          { label: "Success", value: 124, icon: CheckCircle2 },
          { label: "Failed", value: 2, icon: XCircle },
        ].map((item) => (
          <Card key={item.label} className="space-y-3">
            <div className="flex items-center justify-between text-sm text-white/70">
              {item.label}
              <item.icon size={16} />
            </div>
            <div className="text-3xl font-semibold text-white">{item.value}</div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHeader title="Pipeline Stages" subtitle="Latest ERP sync" />
        <div className="mt-6 grid gap-4 sm:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm"
            >
              <div className="text-white/70">Step {index + 1}</div>
              <div className="mt-2 text-lg font-semibold text-white">{step}</div>
              <div className="mt-2 text-xs text-emerald-200">Completed</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHeader title="Recent Jobs" />
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
            {jobsQuery.data.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium text-white">{job.name}</TableCell>
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
        <SectionHeader title="Live Job Logs" />
        <div className="mt-4 space-y-3 text-sm text-white/80">
          {etlLogs.map((log, index) => (
            <div key={`${log.timestamp}-${index}`} className="flex gap-3">
              <span className="text-white/50">{log.timestamp}</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
