const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const fs = require("fs");
const path = require("path");

const { env } = require("./config/env");
const { logger } = require("./config/logger");
const { correlationMiddleware } = require("./middleware/correlation");
const { authOptional, authRequired } = require("./middleware/auth");
const { rbac } = require("./middleware/rbac");
const { rateLimiter } = require("./middleware/rate-limit");
const { cacheResponse } = require("./middleware/cache");
const { maskResponse } = require("./middleware/mask");
const { registerSwagger } = require("./docs/swagger");
const { datasourcesRouter } = require("./routes/datasources");
const { etlRouter } = require("./routes/etl");
const { warehouseRouter } = require("./routes/warehouse");
const { analyticsRouter } = require("./routes/analytics");
const { datamartsRouter } = require("./routes/datamarts");
const { authRouter } = require("./routes/auth");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  })
);
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(correlationMiddleware);
app.use(pinoHttp({ logger }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

registerSwagger(app);

// Serve static files in production (without fallback yet)
let staticDir = null;
if (env.NODE_ENV === "production") {
  const possibleStaticDirs = [
    path.join(__dirname, "../public"),        // Root Dockerfile: ./public
    path.join(__dirname, "../../frontend/out"), // Monorepo structure
    path.join(__dirname, "../..", "public"),    // Alternative root
  ];
  
  staticDir = possibleStaticDirs.find(dir => fs.existsSync(dir));
  
  if (staticDir) {
    logger.info(`Serving static files from: ${staticDir}`);
    app.use(express.static(staticDir));
  } else {
    logger.warn("No static directory found for frontend");
  }
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", authOptional);
app.use(rateLimiter());

app.use("/api/v1/datasources", authRequired, rbac(["ADMIN", "DATA_ENGINEER"]), datasourcesRouter);
app.use("/api/v1/etl", authRequired, rbac(["ADMIN", "DATA_ENGINEER"]), etlRouter);
app.use(
  "/api/v1/warehouse",
  authRequired,
  rbac(["ADMIN", "DATA_ENGINEER"]),
  cacheResponse(30),
  warehouseRouter
);
app.use(
  "/api/v1/analytics",
  authRequired,
  rbac(["ADMIN", "ANALYST", "VIEWER"]),
  cacheResponse(20),
  maskResponse,
  analyticsRouter
);
app.use(
  "/api/v1/datamarts",
  authRequired,
  rbac(["ADMIN", "ANALYST", "VIEWER"]),
  cacheResponse(30),
  maskResponse,
  datamartsRouter
);

// SPA fallback - must be after all API routes
if (staticDir) {
  app.use((req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

app.use((err, req, res, next) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Unexpected error" });
});

module.exports = { app };
