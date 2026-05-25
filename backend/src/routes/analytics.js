const express = require("express");

const router = express.Router();

router.get("/summary", (req, res) => {
  res.json([
    { label: "Total Records Ingested", value: 12450930, change: 0.12 },
    { label: "ETL Success Rate", value: 0.982, change: 0.01 },
    { label: "Active Data Sources", value: 18, change: -0.03 },
    { label: "Last Sync Time", value: 9, change: 0.05 },
  ]);
});

router.get("/timeseries", (req, res) => {
  res.json([
    { label: "Mon", value: 1800 },
    { label: "Tue", value: 2400 },
    { label: "Wed", value: 2100 },
    { label: "Thu", value: 2900 },
    { label: "Fri", value: 3200 },
    { label: "Sat", value: 2600 },
    { label: "Sun", value: 3100 },
  ]);
});

router.get("/source-breakdown", (req, res) => {
  res.json([
    { name: "ERP", value: 45 },
    { name: "POS", value: 25 },
    { name: "Legacy", value: 18 },
    { name: "External", value: 12 },
  ]);
});

module.exports = { analyticsRouter: router };
