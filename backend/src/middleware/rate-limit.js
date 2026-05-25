const limits = {
  ADMIN: 120,
  DATA_ENGINEER: 90,
  ANALYST: 60,
  VIEWER: 40,
};

const requests = new Map();

function rateLimiter() {
  return (req, res, next) => {
    const role = req.user?.role ?? "VIEWER";
    const key = `${role}:${req.ip}`;
    const now = Date.now();
    const windowMs = 60_000;

    const entry = requests.get(key) ?? { count: 0, reset: now + windowMs };
    if (now > entry.reset) {
      entry.count = 0;
      entry.reset = now + windowMs;
    }

    entry.count += 1;
    requests.set(key, entry);

    if (entry.count > (limits[role] ?? 40)) {
      return res.status(429).json({ message: "Rate limit exceeded" });
    }

    return next();
  };
}

module.exports = { rateLimiter };
