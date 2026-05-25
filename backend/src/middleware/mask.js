const maskFields = ["email", "phone", "ssn"];

function maskValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  if (value.length <= 4) {
    return "****";
  }

  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

function maskResponse(req, res, next) {
  const role = req.user?.role ?? "VIEWER";
  if (role === "ADMIN" || role === "DATA_ENGINEER") {
    return next();
  }

  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    const masked = JSON.parse(JSON.stringify(payload));
    const stack = [masked];

    while (stack.length) {
      const current = stack.pop();
      if (Array.isArray(current)) {
        current.forEach((item) => stack.push(item));
        continue;
      }
      if (current && typeof current === "object") {
        Object.entries(current).forEach(([key, value]) => {
          if (maskFields.includes(key)) {
            current[key] = maskValue(value);
          } else if (typeof value === "object") {
            stack.push(value);
          }
        });
      }
    }

    return originalJson(masked);
  };

  return next();
}

module.exports = { maskResponse };
