const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");

const { db } = require("../db");
const { users } = require("../db/schema");

async function findUserByEmail(email) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}

async function verifyUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user || !user.active) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

module.exports = { findUserByEmail, verifyUser };
