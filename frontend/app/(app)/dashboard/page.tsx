"use client";

import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { SourcePieChart } from "@/components/charts/SourcePieChart";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { RecentJobsTable } from "@/components/tables/RecentJobsTable";
import { Card } from "@/components/ui/Card";
import { useEtlJobs, useKpis, useSourceBreakdown, useTimeseries } from "@/lib/api/hooks";

export default function DashboardPage() {
  const kpiQuery = useKpis();
  const timeseriesQuery = useTimeseries();
  const sourcesQuery = useSourceBreakdown();
  const jobsQuery = useEtlJobs();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Executive Overview"
        subtitle="KPI snapshots and ingestion trends across the platform."
      />
      <div className="grid gap-6 lg:grid-cols-4">
        {kpiQuery.data.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            isPercent={kpi.label.includes("Rate")}
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TimeSeriesChart data={timeseriesQuery.data} />
        </div>
        <SourcePieChart data={sourcesQuery.data} />
      </div>
      <Card className="space-y-4">
        <SectionHeader title="Recent ETL Jobs" />
        <RecentJobsTable jobs={jobsQuery.data} />
      </Card>
    </div>
  );
}
