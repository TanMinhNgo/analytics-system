const bcrypt = require("bcryptjs");

const { db } = require("./db");
const { dataSources, users } = require("./db/schema");

async function seed() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await db.insert(users).values([
    {
      name: "Ava Admin",
      email: "admin@analytics.local",
      passwordHash,
      role: "ADMIN",
      active: true,
    },
    {
      name: "Ethan Engineer",
      email: "engineer@analytics.local",
      passwordHash: await bcrypt.hash("engineer123", 10),
      role: "DATA_ENGINEER",
      active: true,
    },
    {
      name: "Nora Analyst",
      email: "analyst@analytics.local",
      passwordHash: await bcrypt.hash("analyst123", 10),
      role: "ANALYST",
      active: true,
    },
    {
      name: "Victor Viewer",
      email: "viewer@analytics.local",
      passwordHash: await bcrypt.hash("viewer123", 10),
      role: "VIEWER",
      active: true,
    },
  ]);

  await db.insert(dataSources).values([
    {
      name: "Apollo ERP",
      type: "ERP",
      config: { host: "erp.internal", database: "apollo" },
      status: "active",
      enabled: true,
    },
    {
      name: "Nova POS",
      type: "POS",
      config: { host: "pos.internal", database: "nova" },
      status: "active",
      enabled: true,
    },
  ]);
}

seed()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
