const { eq } = require("drizzle-orm");
const { db } = require("../../db");
const { dataSources } = require("../../db/schema");
const { encrypt } = require("../../utils/encryption");

async function listSources() {
  return db.select().from(dataSources);
}

async function createSource(payload) {
  const secret = payload.secret ? encrypt(payload.secret) : null;
  const [created] = await db
    .insert(dataSources)
    .values({
      name: payload.name,
      type: payload.type,
      config: payload.config,
      encryptedSecret: secret,
      status: payload.status ?? "active",
      enabled: payload.enabled ?? true,
      lastSyncAt: payload.lastSyncAt ?? null,
    })
    .returning();

  return created;
}

async function updateSource(id, payload) {
  const secret = payload.secret ? encrypt(payload.secret) : undefined;
  const [updated] = await db
    .update(dataSources)
    .set({
      name: payload.name,
      type: payload.type,
      config: payload.config,
      encryptedSecret: secret,
      status: payload.status,
      enabled: payload.enabled,
      lastSyncAt: payload.lastSyncAt,
    })
    .where(eq(dataSources.id, id))
    .returning();

  return updated;
}

module.exports = { listSources, createSource, updateSource };
