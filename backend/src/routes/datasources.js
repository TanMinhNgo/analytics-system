const express = require("express");
const { z } = require("zod");

const { listSources, createSource, updateSource } = require("../modules/datasources/datasource-service");

const router = express.Router();

const datasourceSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["ERP", "POS", "LEGACY", "EXTERNAL", "OLTP"]),
  config: z.record(z.any()),
  secret: z.any().optional(),
  status: z.string().optional(),
  enabled: z.boolean().optional(),
  lastSyncAt: z.string().datetime().optional(),
});

router.get("/", async (req, res) => {
  const sources = await listSources();
  res.json(sources);
});

router.post("/", async (req, res) => {
  const parsed = datasourceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const created = await createSource(parsed.data);
  return res.status(201).json(created);
});

router.patch("/:id", async (req, res) => {
  const parsed = datasourceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const updated = await updateSource(req.params.id, parsed.data);
  return res.json(updated);
});

module.exports = { datasourcesRouter: router };
