const express = require("express");
const { and, desc, eq, gte, sql } = require("drizzle-orm");

const { db } = require("../db");
const { dataSources, etlRuns } = require("../db/schema");

const router = express.Router();

router.get("/summary", async (req, res) => {
  const [totals] = await db
    .select({
      totalRows: sql`coalesce(sum(${etlRuns.rowsProcessed}), 0)`,
      totalRuns: sql`count(*)`,
      successRuns: sql`sum(case when ${etlRuns.status} = 'completed' then 1 else 0 end)`,
      runningRuns: sql`sum(case when ${etlRuns.status} = 'running' then 1 else 0 end)`,
    })
    .from(etlRuns);

  const [activeSources] = await db
    .select({ count: sql`count(*)` })
    .from(dataSources)
    .where(eq(dataSources.enabled, true));

  const [lastRun] = await db
    .select({ startedAt: etlRuns.startedAt })
    .from(etlRuns)
    .orderBy(desc(etlRuns.startedAt))
    .limit(1);

  const totalRuns = Number(totals?.totalRuns ?? 0);
  const successRuns = Number(totals?.successRuns ?? 0);
  const successRate = totalRuns > 0 ? successRuns / totalRuns : 0;

  const lastSyncMinutes = lastRun?.startedAt
    ? Math.max(0, Math.round((Date.now() - new Date(lastRun.startedAt).getTime()) / 60000))
    : 0;

  res.json([
    { label: "Total Records Ingested", value: Number(totals?.totalRows ?? 0), change: 0 },
    { label: "ETL Success Rate", value: Number(successRate.toFixed(4)), change: 0 },
    { label: "Active Data Sources", value: Number(activeSources?.count ?? 0), change: 0 },
    { label: "Last Sync Time", value: lastSyncMinutes, change: 0 },
  ]);
});

router.get("/timeseries", async (req, res) => {
  const daysParam = Number(req.query.days ?? 7);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 90) : 7;
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  startDate.setUTCHours(0, 0, 0, 0);

  const rows = await db
    .select({
      label: sql`to_char(date_trunc('day', ${etlRuns.startedAt}), 'YYYY-MM-DD')`,
      value: sql`coalesce(sum(${etlRuns.rowsProcessed}), 0)`,
    })
    .from(etlRuns)
    .where(gte(etlRuns.startedAt, startDate))
    .groupBy(sql`date_trunc('day', ${etlRuns.startedAt})`)
    .orderBy(sql`date_trunc('day', ${etlRuns.startedAt})`);

  res.json(rows.map((row) => ({ label: row.label, value: Number(row.value ?? 0) })));
});

router.get("/source-breakdown", async (req, res) => {
  const rows = await db
    .select({
      name: dataSources.type,
      value: sql`coalesce(sum(${etlRuns.rowsProcessed}), 0)`,
    })
    .from(dataSources)
    .leftJoin(etlRuns, and(eq(dataSources.id, etlRuns.sourceId), eq(etlRuns.status, "completed")))
    .groupBy(dataSources.type)
    .orderBy(desc(sql`coalesce(sum(${etlRuns.rowsProcessed}), 0)`));

  res.json(rows.map((row) => ({ name: row.name, value: Number(row.value ?? 0) })));
});

module.exports = { analyticsRouter: router };
