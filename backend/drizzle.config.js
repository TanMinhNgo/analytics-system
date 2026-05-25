const { env } = require("./src/config/env");

module.exports = {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
};
