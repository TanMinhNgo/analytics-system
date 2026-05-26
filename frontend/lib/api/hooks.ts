import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import {
  dataMarts,
  dataSources,
  etlJobs,
  kpis,
  sourceBreakdown,
  timeseries,
  warehouseTables,
} from "@/lib/mock-data";
import type { DataMart, WarehouseTable } from "@/types/warehouse";
import type { DataSource } from "@/types/datasource";
import type { EtlJob } from "@/types/etl";
import type { Kpi, SourceBreakdown, TimeseriesPoint } from "@/types/analytics";

export function useKpis() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: async () => apiClient<Kpi[]>("/api/v1/analytics/summary").catch(() => kpis),
    initialData: kpis,
  });
}

export function useTimeseries() {
  return useQuery({
    queryKey: ["analytics", "timeseries"],
    queryFn: async () =>
      apiClient<TimeseriesPoint[]>("/api/v1/analytics/timeseries").catch(() => timeseries),
    initialData: timeseries,
  });
}

export function useSourceBreakdown() {
  return useQuery({
    queryKey: ["analytics", "sources"],
    queryFn: async () =>
      apiClient<SourceBreakdown[]>("/api/v1/analytics/source-breakdown").catch(
        () => sourceBreakdown
      ),
    initialData: sourceBreakdown,
  });
}

export function useEtlJobs() {
  return useQuery({
    queryKey: ["etl", "jobs"],
    queryFn: async () => apiClient<EtlJob[]>("/api/v1/etl/jobs").catch(() => etlJobs),
    initialData: etlJobs,
  });
}

export function useDataSources() {
  return useQuery({
    queryKey: ["datasources"],
    queryFn: async () => apiClient<DataSource[]>("/api/v1/datasources").catch(() => dataSources),
    initialData: dataSources,
  });
}

export function useWarehouseTables() {
  return useQuery({
    queryKey: ["warehouse", "tables"],
    queryFn: async () =>
      apiClient<WarehouseTable[]>("/api/v1/warehouse/tables").catch(() => warehouseTables),
    initialData: warehouseTables,
  });
}

export function useDataMarts() {
  return useQuery({
    queryKey: ["warehouse", "marts"],
    queryFn: async () => apiClient<DataMart[]>("/api/v1/datamarts").catch(() => dataMarts),
    initialData: dataMarts,
  });
}
