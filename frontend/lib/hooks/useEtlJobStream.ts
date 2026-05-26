"use client";

import { useEffect, useMemo, useState } from "react";

import type { EtlLogEntry } from "@/types/etl";

export function useEtlJobStream(jobId?: string) {
  const [logs, setLogs] = useState<EtlLogEntry[]>([]);
  const wsUrl = useMemo(() => process.env.NEXT_PUBLIC_WS_URL, []);

  useEffect(() => {
    if (!wsUrl || !jobId) {
      return;
    }

    const socket = new WebSocket(`${wsUrl}/etl?jobId=${jobId}`);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as EtlLogEntry;
        setLogs((prev) => [...prev, payload]);
      } catch {
        setLogs((prev) => [...prev, { timestamp: new Date().toISOString(), message: event.data }]);
      }
    };

    return () => {
      socket.close();
    };
  }, [jobId, wsUrl]);

  return logs;
}
