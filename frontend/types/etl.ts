export type EtlStep = "SELECT" | "EXTRACT" | "TRANSFORM" | "INTEGRATE" | "LOAD";

export type EtlJob = {
  id: string;
  name: string;
  status: "queued" | "running" | "success" | "failed";
  durationMs: number;
  rowsProcessed: number;
  startedAt: string;
};

export type EtlLogEntry = {
  timestamp: string;
  message: string;
};
