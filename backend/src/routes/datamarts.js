const express = require("express");

const router = express.Router();

const marts = [
  {
    name: "cardiac_data",
    description: "Cardiology-focused intake and outcomes metrics.",
    rowCount: 120400,
  },
  {
    name: "revenue_cycle",
    description: "Revenue cycle KPIs and payer mix breakdown.",
    rowCount: 98230,
  },
  {
    name: "operational_efficiency",
    description: "Operational metrics for staffing and throughput.",
    rowCount: 75980,
  },
];

router.get("/", (req, res) => {
  res.json(marts);
});

router.get("/:name/data", (req, res) => {
  const mart = marts.find((item) => item.name === req.params.name);
  if (!mart) {
    return res.status(404).json({ message: "Data mart not found" });
  }

  return res.json({
    mart,
    rows: [],
  });
});

module.exports = { datamartsRouter: router };
