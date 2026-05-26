const bcrypt = require("bcryptjs");

const { db } = require("./db");
const { dataSources, users, etlRuns, etlLogs } = require("./db/schema");

async function seed() {
  console.log("🌱 Starting seed...");

  // Insert Users
  console.log("👥 Seeding users...");
  const passwordHash = await bcrypt.hash("admin123", 10);

  const insertedUsers = await db.insert(users).values([
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
    {
      name: "Sophie Manager",
      email: "manager@analytics.local",
      passwordHash: await bcrypt.hash("manager123", 10),
      role: "ANALYST",
      active: true,
    },
  ]).returning();
  console.log(`✅ Created ${insertedUsers.length} users`);

  // Insert Data Sources
  console.log("🔌 Seeding data sources...");
  const insertedSources = await db.insert(dataSources).values([
    {
      name: "Apollo ERP",
      type: "ERP",
      config: { 
        host: "erp.internal", 
        database: "apollo",
        port: 5432,
        schema: "public"
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      name: "Nova POS",
      type: "POS",
      config: { 
        host: "pos.internal", 
        database: "nova",
        port: 5432,
        version: "v2.1"
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    },
    {
      name: "Salesforce CRM",
      type: "CRM",
      config: { 
        apiEndpoint: "https://api.salesforce.com",
        apiVersion: "v52.0"
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      name: "Azure Data Warehouse",
      type: "WAREHOUSE",
      config: { 
        host: "analytics.database.windows.net",
        database: "warehouse_prod",
        port: 1433
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      name: "Shopify Store",
      type: "E_COMMERCE",
      config: { 
        storeUrl: "https://mystore.myshopify.com",
        apiVersion: "2024-01"
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      name: "Legacy MySQL DB",
      type: "DATABASE",
      config: { 
        host: "legacy.internal",
        database: "old_system",
        port: 3306
      },
      status: "inactive",
      enabled: false,
      lastSyncAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    {
      name: "Google Analytics API",
      type: "API",
      config: { 
        propertyId: "UA-123456789-1",
        apiVersion: "v4"
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      name: "Stripe Payments",
      type: "PAYMENT",
      config: { 
        apiEndpoint: "https://api.stripe.com",
        webhookEnabled: true
      },
      status: "active",
      enabled: true,
      lastSyncAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    },
  ]).returning();
  console.log(`✅ Created ${insertedSources.length} data sources`);

  // Insert ETL Runs
  console.log("⚙️ Seeding ETL runs...");
  const now = new Date();
  const insertedRuns = await db.insert(etlRuns).values([
    // Completed runs
    {
      sourceId: insertedSources[0].id, // Apollo ERP
      status: "completed",
      rowsProcessed: 15240,
      durationMs: 45000,
      startedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000 + 45000),
    },
    {
      sourceId: insertedSources[1].id, // Nova POS
      status: "completed",
      rowsProcessed: 8920,
      durationMs: 32000,
      startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 32000),
    },
    {
      sourceId: insertedSources[2].id, // Salesforce CRM
      status: "completed",
      rowsProcessed: 5420,
      durationMs: 67000,
      startedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000 + 67000),
    },
    {
      sourceId: insertedSources[4].id, // Shopify Store
      status: "completed",
      rowsProcessed: 12350,
      durationMs: 28000,
      startedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000 + 28000),
    },
    {
      sourceId: insertedSources[7].id, // Stripe Payments
      status: "completed",
      rowsProcessed: 3210,
      durationMs: 15000,
      startedAt: new Date(now.getTime() - 30 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 30 * 60 * 1000 + 15000),
    },
    // Failed run
    {
      sourceId: insertedSources[3].id, // Azure Data Warehouse
      status: "failed",
      rowsProcessed: 1200,
      durationMs: 12000,
      startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000 + 12000),
    },
    // Running job
    {
      sourceId: insertedSources[6].id, // Google Analytics API
      status: "running",
      rowsProcessed: 2100,
      durationMs: 0,
      startedAt: new Date(now.getTime() - 5 * 60 * 1000),
      finishedAt: null,
    },
    // More historical completed runs
    {
      sourceId: insertedSources[0].id, // Apollo ERP (yesterday)
      status: "completed",
      rowsProcessed: 14890,
      durationMs: 43000,
      startedAt: new Date(now.getTime() - 27 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 27 * 60 * 60 * 1000 + 43000),
    },
    {
      sourceId: insertedSources[1].id, // Nova POS (yesterday)
      status: "completed",
      rowsProcessed: 9120,
      durationMs: 35000,
      startedAt: new Date(now.getTime() - 26 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 26 * 60 * 60 * 1000 + 35000),
    },
    {
      sourceId: insertedSources[5].id, // Legacy MySQL DB (old failed run)
      status: "failed",
      rowsProcessed: 0,
      durationMs: 5000,
      startedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      finishedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000 + 5000),
    },
  ]).returning();
  console.log(`✅ Created ${insertedRuns.length} ETL runs`);

  // Insert ETL Logs
  console.log("📝 Seeding ETL logs...");
  const logsToInsert = [];

  // Logs for run 0 (Apollo ERP - completed)
  logsToInsert.push(
    { runId: insertedRuns[0].id, message: "ETL job started for Apollo ERP" },
    { runId: insertedRuns[0].id, message: "Connected to source database successfully" },
    { runId: insertedRuns[0].id, message: "Extracting data from tables: orders, customers, products" },
    { runId: insertedRuns[0].id, message: "Processed 5000 rows from orders table" },
    { runId: insertedRuns[0].id, message: "Processed 8000 rows from customers table" },
    { runId: insertedRuns[0].id, message: "Processed 2240 rows from products table" },
    { runId: insertedRuns[0].id, message: "Data transformation completed" },
    { runId: insertedRuns[0].id, message: "Loading data into warehouse" },
    { runId: insertedRuns[0].id, message: "ETL job completed successfully - 15240 rows processed" }
  );

  // Logs for run 1 (Nova POS - completed)
  logsToInsert.push(
    { runId: insertedRuns[1].id, message: "ETL job started for Nova POS" },
    { runId: insertedRuns[1].id, message: "Connected to POS database" },
    { runId: insertedRuns[1].id, message: "Extracting sales transactions" },
    { runId: insertedRuns[1].id, message: "Processed 8920 transactions" },
    { runId: insertedRuns[1].id, message: "Data validation passed" },
    { runId: insertedRuns[1].id, message: "ETL job completed successfully" }
  );

  // Logs for run 2 (Salesforce CRM - completed)
  logsToInsert.push(
    { runId: insertedRuns[2].id, message: "ETL job started for Salesforce CRM" },
    { runId: insertedRuns[2].id, message: "Authenticating with Salesforce API" },
    { runId: insertedRuns[2].id, message: "Fetching accounts and opportunities" },
    { runId: insertedRuns[2].id, message: "Rate limiting detected, throttling requests" },
    { runId: insertedRuns[2].id, message: "Processed 3200 accounts" },
    { runId: insertedRuns[2].id, message: "Processed 2220 opportunities" },
    { runId: insertedRuns[2].id, message: "ETL job completed successfully" }
  );

  // Logs for run 5 (Azure Data Warehouse - failed)
  logsToInsert.push(
    { runId: insertedRuns[5].id, message: "ETL job started for Azure Data Warehouse" },
    { runId: insertedRuns[5].id, message: "Attempting connection to warehouse" },
    { runId: insertedRuns[5].id, message: "Connection timeout after 10 seconds" },
    { runId: insertedRuns[5].id, message: "Retrying connection (attempt 2/3)" },
    { runId: insertedRuns[5].id, message: "Connection failed: Network unreachable" },
    { runId: insertedRuns[5].id, message: "ERROR: Unable to connect to Azure Data Warehouse" },
    { runId: insertedRuns[5].id, message: "ETL job failed - check network connectivity" }
  );

  // Logs for run 6 (Google Analytics - running)
  logsToInsert.push(
    { runId: insertedRuns[6].id, message: "ETL job started for Google Analytics API" },
    { runId: insertedRuns[6].id, message: "Authenticating with Google API" },
    { runId: insertedRuns[6].id, message: "Fetching pageviews and sessions data" },
    { runId: insertedRuns[6].id, message: "Processing batch 1/5 - 2100 rows" }
  );

  // Logs for run 9 (Legacy MySQL - failed)
  logsToInsert.push(
    { runId: insertedRuns[9].id, message: "ETL job started for Legacy MySQL DB" },
    { runId: insertedRuns[9].id, message: "ERROR: Database credentials invalid" },
    { runId: insertedRuns[9].id, message: "ETL job failed - authentication error" }
  );

  const insertedLogs = await db.insert(etlLogs).values(logsToInsert).returning();
  console.log(`✅ Created ${insertedLogs.length} ETL logs`);

  console.log("\n✨ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Users: ${insertedUsers.length}`);
  console.log(`   Data Sources: ${insertedSources.length}`);
  console.log(`   ETL Runs: ${insertedRuns.length}`);
  console.log(`   ETL Logs: ${insertedLogs.length}`);
  console.log("\n🔐 Login credentials:");
  console.log("   Admin: admin@analytics.local / admin123");
  console.log("   Engineer: engineer@analytics.local / engineer123");
  console.log("   Analyst: analyst@analytics.local / analyst123");
  console.log("   Viewer: viewer@analytics.local / viewer123");
  console.log("   Manager: manager@analytics.local / manager123");
}

seed()
  .then(() => {
    console.log("\n👋 Exiting...");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Seed failed:");
    console.error(err);
    process.exit(1);
  });
