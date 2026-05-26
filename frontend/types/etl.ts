export type EtlStep = "SELECT" | "EXTRACT" | "TRANSFORM" | "INTEGRATE" | "LOAD";

export type EtlJob = {
  id: string;
  name: string;
  status: "running" | "success" | "failed" | "queued";
  durationMs: number;
  rowsProcessed: number;
  startedAt: string;
};

export type EtlLogEntry = {
  timestamp: string;
  message: string;
};
