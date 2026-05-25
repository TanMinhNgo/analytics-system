import type { DataSource } from "@/types/datasource";
import type { EtlJob, EtlLogEntry } from "@/types/etl";
import type { DataMart, WarehouseTable } from "@/types/warehouse";
import type { Kpi, SourceBreakdown, TimeseriesPoint } from "@/types/analytics";

export const kpis: Kpi[] = [
  { label: "Total Records Ingested", value: 12_450_930, change: 0.12 },
  { label: "ETL Success Rate", value: 0.982, change: 0.01 },
  { label: "Active Data Sources", value: 18, change: -0.03 },
  { label: "Last Sync Time", value: 9, change: 0.05 },
];

export const timeseries: TimeseriesPoint[] = [
  { label: "Mon", value: 1800 },
  { label: "Tue", value: 2400 },
  { label: "Wed", value: 2100 },
  { label: "Thu", value: 2900 },
  { label: "Fri", value: 3200 },
  { label: "Sat", value: 2600 },
  { label: "Sun", value: 3100 },
];

export const sourceBreakdown: SourceBreakdown[] = [
  { name: "ERP", value: 45 },
  { name: "POS", value: 25 },
  { name: "Legacy", value: 18 },
  { name: "External", value: 12 },
];

export const etlJobs: EtlJob[] = [
  {
    id: "job_1842",
    name: "Daily ERP Sync",
    status: "running",
    durationMs: 214000,
    rowsProcessed: 182340,
    startedAt: "2026-05-25T07:45:00Z",
  },
  {
    id: "job_1841",
    name: "POS Hourly",
    status: "success",
    durationMs: 84000,
    rowsProcessed: 84221,
    startedAt: "2026-05-25T06:00:00Z",
  },
  {
    id: "job_1840",
    name: "Legacy Weekly",
    status: "failed",
    durationMs: 192000,
    rowsProcessed: 12000,
    startedAt: "2026-05-25T05:00:00Z",
  },
];

export const etlLogs: EtlLogEntry[] = [
  { timestamp: "07:45:12", message: "SELECT completed in 12s" },
  { timestamp: "07:45:28", message: "EXTRACT streaming rows" },
  { timestamp: "07:46:10", message: "TRANSFORM rules applied" },
  { timestamp: "07:46:32", message: "INTEGRATE staging sync" },
];

export const dataSources: DataSource[] = [
  {
    id: "src_01",
    name: "Apollo ERP",
    type: "ERP",
    status: "active",
    lastSync: "2026-05-25T07:45:00Z",
    enabled: true,
  },
  {
    id: "src_02",
    name: "Nova POS",
    type: "POS",
    status: "active",
    lastSync: "2026-05-25T06:30:00Z",
    enabled: true,
  },
  {
    id: "src_03",
    name: "Legacy Billing",
    type: "LEGACY",
    status: "error",
    lastSync: "2026-05-24T19:10:00Z",
    enabled: false,
  },
  {
    id: "src_04",
    name: "External Labs",
    type: "EXTERNAL",
    status: "paused",
    lastSync: "2026-05-25T03:10:00Z",
    enabled: true,
  },
];

export const warehouseTables: WarehouseTable[] = [
  {
    name: "fact_transactions",
    columns: [
      { name: "transaction_id", type: "uuid" },
      { name: "patient_id", type: "uuid" },
      { name: "amount", type: "numeric" },
    ],
    rowCount: 2_140_000,
    lastUpdated: "2026-05-25T06:50:00Z",
  },
  {
    name: "dim_patients",
    columns: [
      { name: "patient_id", type: "uuid" },
      { name: "city", type: "text" },
      { name: "segment", type: "text" },
    ],
    rowCount: 180_000,
    lastUpdated: "2026-05-25T06:50:00Z",
  },
];

export const dataMarts: DataMart[] = [
  {
    name: "cardiac_data",
    description: "Cardiology-focused intake and outcomes metrics.",
    rowCount: 120_400,
  },
  {
    name: "revenue_cycle",
    description: "Revenue cycle KPIs and payer mix breakdown.",
    rowCount: 98_230,
  },
  {
    name: "operational_efficiency",
    description: "Operational metrics for staffing and throughput.",
    rowCount: 75_980,
  },
];
