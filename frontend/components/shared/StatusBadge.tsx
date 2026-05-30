import { Badge } from "@/components/ui/Badge";

const toneByStatus: Record<string, "success" | "warning" | "error" | "info"> = {
  running: "info",
  success: "success",
  completed: "success",
  failed: "error",
  queued: "warning",
  active: "success",
  paused: "warning",
  error: "error",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={toneByStatus[status] ?? "neutral"}>{status}</Badge>;
}
