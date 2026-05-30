export type DataSourceType = "ERP" | "POS" | "LEGACY" | "EXTERNAL" | "OLTP";

export type DataSource = {
  id: string;
  name: string;
  type: DataSourceType;
  config?: Record<string, unknown>;
  status: "active" | "paused" | "error";
  lastSync: string;
  enabled: boolean;
};
