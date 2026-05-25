const Redis = require("ioredis");
const { env } = require("../config/env");

let redis;

function getRedis() {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
    });
  }

  return redis;
}

module.exports = { getRedis };
