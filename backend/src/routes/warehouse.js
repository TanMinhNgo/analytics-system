const express = require("express");

const router = express.Router();

router.get("/query", (req, res) => {
  res.json({
    rows: [],
    pagination: { page: 1, pageSize: 25, total: 0 },
  });
});

router.get("/tables", (req, res) => {
  res.json([
    {
      name: "fact_transactions",
      columns: [
        { name: "transaction_id", type: "uuid" },
        { name: "patient_id", type: "uuid" },
        { name: "amount", type: "numeric" },
      ],
      rowCount: 2140000,
      lastUpdated: new Date().toISOString(),
    },
  ]);
});

module.exports = { warehouseRouter: router };
