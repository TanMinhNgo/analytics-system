const bcrypt = require("bcryptjs");
const express = require("express");
const { z } = require("zod");
const { desc, eq } = require("drizzle-orm");

const { db } = require("../db");
const { users } = require("../db/schema");

const router = express.Router();

const roles = ["ADMIN", "DATA_ENGINEER", "ANALYST", "VIEWER"];

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(roles),
  active: z.boolean().default(true),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  role: z.enum(roles).optional(),
  active: z.boolean().optional(),
});

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  };
}

router.get("/", async (req, res) => {
  const rows = await db.select().from(users).orderBy(desc(users.createdAt));
  res.json(rows.map(toPublicUser));
});

router.post("/", async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const [created] = await db
    .insert(users)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      active: parsed.data.active,
    })
    .returning();

  return res.status(201).json(toPublicUser(created));
});

router.patch("/:id", async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const updateValues = { ...parsed.data };
  if (parsed.data.password) {
    updateValues.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    delete updateValues.password;
  }

  const [updated] = await db
    .update(users)
    .set(updateValues)
    .where(eq(users.id, req.params.id))
    .returning();

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(toPublicUser(updated));
});

module.exports = { usersRouter: router };
