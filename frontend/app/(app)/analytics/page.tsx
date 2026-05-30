"use client";

import { SourcePieChart } from "@/components/charts/SourcePieChart";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { EmptyState } from "@/components/shared/EmptyState";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useKpis, useSourceBreakdown, useTimeseries } from "@/lib/api/hooks";

export default function AnalyticsPage() {
  const kpiQuery = useKpis();
  const timeseriesQuery = useTimeseries();
  const sourceQuery = useSourceBreakdown();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics"
        subtitle="Visual insights for ingestion trends and source contribution."
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {kpiQuery.data.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={Number(kpi.value ?? 0)}
            change={kpi.change}
            isPercent={kpi.label.includes("Rate")}
          />
        ))}
      </div>

      {timeseriesQuery.data.length === 0 && sourceQuery.data.length === 0 ? (
        <EmptyState
          title="No analytics data"
          description="Data will appear after ETL runs complete."
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TimeSeriesChart data={timeseriesQuery.data} />
        </div>
        <SourcePieChart data={sourceQuery.data} />
      </div>
    </div>
  );
}
