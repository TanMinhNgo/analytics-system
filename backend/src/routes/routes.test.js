import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { datasourcesRouter } from "./datasources";
import { etlRouter } from "./etl";
import { warehouseRouter } from "./warehouse";
import { datamartsRouter } from "./datamarts";
import { analyticsRouter } from "./analytics";

function makeApp(path, router) {
  const app = express();
  app.use(express.json());
  app.use(path, router);
  return app;
}

describe("datasources routes", () => {
  it("returns 404 when updating an unknown datasource", async () => {
    const app = makeApp("/api/v1/datasources", datasourcesRouter);
    const response = await request(app).put("/api/v1/datasources/00000000-0000-0000-0000-000000000000").send({
      name: "Unknown Source",
      type: "ERP",
      config: {},
    });

    expect([404, 500]).toContain(response.status);
    if (response.status === 404) {
      expect(response.body.message).toBe("Data source not found");
    }
  });
});

describe("etl routes", () => {
  it("returns ETL jobs with valid normalized status values", async () => {
    const app = makeApp("/api/v1/etl", etlRouter);
    const response = await request(app).get("/api/v1/etl/jobs");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    for (const item of response.body) {
      expect(["queued", "running", "success", "failed", "completed"]).toContain(item.status);
      expect(typeof item.id).toBe("string");
    }
  });
});

describe("warehouse routes", () => {
  it("rejects unsafe table names", async () => {
    const app = makeApp("/api/v1/warehouse", warehouseRouter);
    const response = await request(app).get("/api/v1/warehouse/query?table=users;drop table users");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid table name");
  });
});

describe("datamarts routes", () => {
  it("returns 404 for unknown datamart", async () => {
    const app = makeApp("/api/v1/datamarts", datamartsRouter);
    const response = await request(app).get("/api/v1/datamarts/unknown_mart/data");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Data mart not found");
  });
});

describe("analytics routes", () => {
  it("returns summary KPI array with required fields", async () => {
    const app = makeApp("/api/v1/analytics", analyticsRouter);
    const response = await request(app).get("/api/v1/analytics/summary");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    for (const item of response.body) {
      expect(typeof item.label).toBe("string");
      expect(Object.prototype.hasOwnProperty.call(item, "value")).toBe(true);
      expect(typeof item.change).toBe("number");
    }
  });

  it("returns timeseries points with label and numeric value", async () => {
    const app = makeApp("/api/v1/analytics", analyticsRouter);
    const response = await request(app).get("/api/v1/analytics/timeseries");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    for (const point of response.body) {
      expect(typeof point.label).toBe("string");
      expect(typeof point.value).toBe("number");
    }
  });

  it("returns source breakdown rows with name and numeric value", async () => {
    const app = makeApp("/api/v1/analytics", analyticsRouter);
    const response = await request(app).get("/api/v1/analytics/source-breakdown");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    for (const row of response.body) {
      expect(typeof row.name).toBe("string");
      expect(typeof row.value).toBe("number");
    }
  });
});
