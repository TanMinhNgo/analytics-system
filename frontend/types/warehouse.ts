export type WarehouseTable = {
  name: string;
  columns: Array<{ name: string; type: string }>;
  rowCount: number;
  lastUpdated: string;
};

export type DataMart = {
  name: string;
  description: string;
  rowCount: number;
};
