const express = require("express");
const { z } = require("zod");
const { sql } = require("drizzle-orm");

const { db } = require("../db");

const router = express.Router();

const querySchema = z.object({
  table: z.string().min(1),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
});

router.get("/query", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid query params" });
  }

  const { table, page, pageSize } = parsed.data;
  const offset = (page - 1) * pageSize;

  // Strict identifier sanitization to avoid SQL injection via dynamic table names.
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
    return res.status(400).json({ message: "Invalid table name" });
  }

  const rows = await db.execute(
    sql.raw(`select * from "${table}" limit ${pageSize} offset ${offset}`)
  );
  const totalResult = await db.execute(sql.raw(`select count(*)::int as total from "${table}"`));
  const total = Number(totalResult.rows?.[0]?.total ?? 0);

  return res.json({
    rows: rows.rows ?? [],
    pagination: { page, pageSize, total },
  });
});

router.get("/tables", async (req, res) => {
  const tablesResult = await db.execute(sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_type = 'BASE TABLE'
    order by table_name
  `);

  const tables = [];
  for (const item of tablesResult.rows ?? []) {
    const tableName = item.table_name;
    const columnsResult = await db.execute(sql`
      select column_name as name, data_type as type
      from information_schema.columns
      where table_schema = 'public' and table_name = ${tableName}
      order by ordinal_position
    `);

    const rowCountResult = await db.execute(
      sql.raw(`select count(*)::int as count from "${tableName}"`)
    );

    tables.push({
      name: tableName,
      columns: columnsResult.rows ?? [],
      rowCount: Number(rowCountResult.rows?.[0]?.count ?? 0),
      lastUpdated: new Date().toISOString(),
    });
  }

  res.json(tables);
});

module.exports = { warehouseRouter: router };
