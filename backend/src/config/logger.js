const pino = require("pino");
const { env } = require("./env");

const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: { colorize: true },
        },
});

module.exports = { logger };
