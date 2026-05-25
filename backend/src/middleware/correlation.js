const { v4: uuid } = require("uuid");

function correlationMiddleware(req, res, next) {
  const incoming = req.headers["x-correlation-id"];
  const correlationId = incoming ? String(incoming) : uuid();
  req.correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);
  next();
}

module.exports = { correlationMiddleware };
