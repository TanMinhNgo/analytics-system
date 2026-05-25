const express = require("express");
const { z } = require("zod");

const { addEtlJob, getJob, steps } = require("../etl/etl-queue");

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

  const job = await addEtlJob({
    sourceId: parsed.data.sourceId,
    triggeredBy: parsed.data.triggeredBy ?? req.user?.email,
  });

  res.status(202).json({
    id: job.id,
    steps,
  });
});

router.get("/jobs/:id", async (req, res) => {
  const job = await getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const state = await job.getState();
  const result = await job.returnvalue;

  res.json({
    id: job.id,
    name: job.name,
    state,
    data: job.data,
    result,
  });
});

module.exports = { etlRouter: router };
