const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");

const { env } = require("../config/env");
const schema = require("./schema");

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool, { schema });

module.exports = { db, pool };
