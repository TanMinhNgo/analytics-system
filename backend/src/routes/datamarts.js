const express = require("express");
const { and, desc, eq, inArray, sql } = require("drizzle-orm");

const { db } = require("../db");
const { dataSources, etlRuns } = require("../db/schema");

const router = express.Router();

router.get("/", async (req, res) => {
  const rows = await db
    .select({
      type: dataSources.type,
      rowCount: sql`coalesce(sum(${etlRuns.rowsProcessed}), 0)`,
    })
    .from(dataSources)
    .leftJoin(etlRuns, and(eq(etlRuns.sourceId, dataSources.id), eq(etlRuns.status, "completed")))
    .groupBy(dataSources.type)
    .orderBy(desc(sql`coalesce(sum(${etlRuns.rowsProcessed}), 0)`));

  const marts = rows.map((row) => ({
    name: `${String(row.type).toLowerCase()}_mart`,
    description: `Aggregated analytics mart for ${row.type} data sources.`,
    rowCount: Number(row.rowCount ?? 0),
  }));

  res.json(marts);
});

router.get("/:name/data", async (req, res) => {
  const type = req.params.name.replace(/_mart$/i, "").toUpperCase();
  const sourceRows = await db
    .select({ id: dataSources.id, name: dataSources.name, type: dataSources.type })
    .from(dataSources)
    .where(eq(dataSources.type, type));

  if (sourceRows.length === 0) {
    return res.status(404).json({ message: "Data mart not found" });
  }

  const sourceIds = sourceRows.map((row) => row.id);
  const rows = await db
    .select({
      id: etlRuns.id,
      sourceId: etlRuns.sourceId,
      status: etlRuns.status,
      rowsProcessed: etlRuns.rowsProcessed,
      durationMs: etlRuns.durationMs,
      startedAt: etlRuns.startedAt,
      finishedAt: etlRuns.finishedAt,
    })
    .from(etlRuns)
    .where(inArray(etlRuns.sourceId, sourceIds))
    .orderBy(desc(etlRuns.startedAt))
    .limit(200);

  return res.json({
    mart: {
      name: `${type.toLowerCase()}_mart`,
      description: `Aggregated analytics mart for ${type} data sources.`,
      rowCount: rows.length,
    },
    rows,
  });
});

module.exports = { datamartsRouter: router };
