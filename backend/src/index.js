const http = require("http");

const { app } = require("./app");
const { env } = require("./config/env");
const { logger } = require("./config/logger");
const { initQueues } = require("./etl/etl-queue");
const { setupWebsocket } = require("./realtime/ws");

async function start() {
  await initQueues();

  const server = http.createServer(app);
  setupWebsocket(server);

  server.listen(env.PORT, () => {
    logger.info(`Backend listening on port ${env.PORT}`);
  });

  const shutdown = () => {
    logger.info("Shutting down server");
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
