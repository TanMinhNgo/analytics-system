const express = require("express");
const { z } = require("zod");

const { verifyUser } = require("../services/user-service");
const { signToken } = require("../utils/jwt");

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const user = await verifyUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  return res.json({
    accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = { authRouter: router };
