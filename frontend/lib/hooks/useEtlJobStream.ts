"use client";

import { useEffect, useMemo, useState } from "react";

import type { EtlLogEntry } from "@/types/etl";

export function useEtlJobStream(jobId?: string) {
  const [logs, setLogs] = useState<EtlLogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_WS_URL) {
      return process.env.NEXT_PUBLIC_WS_URL;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return null;
    }
    return apiUrl.replace(/^http/i, "ws");
  }, []);
  const wsPath = useMemo(() => process.env.NEXT_PUBLIC_WS_ETL_PATH ?? "/etl", []);

  useEffect(() => {
    if (!wsUrl || !jobId) {
      return;
    }

    const socket = new WebSocket(`${wsUrl}${wsPath}?jobId=${jobId}`);

    socket.onopen = () => {
      setError(null);
      setConnected(true);
    };

    socket.onerror = () => {
      setError("Unable to connect to ETL stream.");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as EtlLogEntry;
        setLogs((prev) => [...prev, payload].slice(-200));
      } catch {
        setLogs((prev) =>
          [...prev, { timestamp: new Date().toISOString(), message: event.data }].slice(-200)
        );
      }
    };

    return () => {
      setConnected(false);
      socket.close();
    };
  }, [jobId, wsPath, wsUrl]);

  return { logs, connected, error };
}
