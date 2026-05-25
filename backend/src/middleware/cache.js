const { getRedis } = require("../services/redis");

function cacheResponse(ttlSeconds) {
  return async (req, res, next) => {
    const redis = getRedis();
    const key = `cache:${req.originalUrl}`;

    const cached = await redis.get(key);
    if (cached) {
      res.setHeader("x-cache", "hit");
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      redis.setex(key, ttlSeconds, JSON.stringify(payload)).catch(() => null);
      res.setHeader("x-cache", "miss");
      return originalJson(payload);
    };

    return next();
  };
}

module.exports = { cacheResponse };
