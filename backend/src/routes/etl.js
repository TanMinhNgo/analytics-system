const express = require("express");
const { z } = require("zod");
const { desc, eq } = require("drizzle-orm");

const { addEtlJob, getJob, steps } = require("../etl/etl-queue");
const { db } = require("../db");
const { dataSources, etlLogs, etlRuns } = require("../db/schema");

const router = express.Router();

const runSchema = z.object({
  sourceId: z.string().uuid().optional(),
  triggeredBy: z.string().optional(),
});

router.post("/run", async (req, res) => {
  const parsed = runSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  let sourceId = parsed.data.sourceId;
  if (!sourceId) {
    const [defaultSource] = await db
      .select({ id: dataSources.id })
      .from(dataSources)
      .where(eq(dataSources.enabled, true))
      .limit(1);
    sourceId = defaultSource?.id;
  }

  if (!sourceId) {
    return res.status(400).json({ message: "No available data source" });
  }

  const job = await addEtlJob({
    sourceId,
    triggeredBy: parsed.data.triggeredBy ?? req.user?.email,
  });

  await db.insert(etlRuns).values({
    sourceId,
    status: "queued",
    rowsProcessed: 0,
    durationMs: 0,
    startedAt: new Date(),
  });

  res.status(202).json({
    id: job.id,
    steps,
  });
});

router.get("/jobs", async (req, res) => {
  const rows = await db
    .select({
      id: etlRuns.id,
      sourceId: etlRuns.sourceId,
      status: etlRuns.status,
      rowsProcessed: etlRuns.rowsProcessed,
      durationMs: etlRuns.durationMs,
      startedAt: etlRuns.startedAt,
      sourceName: dataSources.name,
    })
    .from(etlRuns)
    .leftJoin(dataSources, eq(etlRuns.sourceId, dataSources.id))
    .orderBy(desc(etlRuns.startedAt))
    .limit(200);

  res.json(
    rows.map((row) => ({
      id: row.id,
      name: row.sourceName ? `${row.sourceName} ETL` : "ETL Run",
      status: row.status === "completed" ? "success" : row.status,
      durationMs: row.durationMs ?? 0,
      rowsProcessed: row.rowsProcessed ?? 0,
      startedAt: row.startedAt,
      sourceId: row.sourceId,
    }))
  );
});

router.get("/jobs/:id", async (req, res) => {
  const [run] = await db.select().from(etlRuns).where(eq(etlRuns.id, req.params.id)).limit(1);
  if (!run) {
    const job = await getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const state = await job.getState();
    const result = await job.returnvalue;

    return res.json({
      id: job.id,
      name: job.name,
      state,
      data: job.data,
      result,
    });
  }

  const logs = await db
    .select({ createdAt: etlLogs.createdAt, message: etlLogs.message })
    .from(etlLogs)
    .where(eq(etlLogs.runId, run.id))
    .orderBy(desc(etlLogs.createdAt))
    .limit(500);

  return res.json({
    id: run.id,
    name: "ETL Run",
    state: run.status,
    data: { sourceId: run.sourceId },
    result: {
      rowsProcessed: run.rowsProcessed,
      durationMs: run.durationMs,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      logs: logs.map((item) => ({
        timestamp: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
        message: item.message,
      })),
    },
  });
});

module.exports = { etlRouter: router };
