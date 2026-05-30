import { cookies } from "next/headers";

import { Roles, type Role } from "@/lib/auth/roles";

const ROLE_COOKIE = "ads_role";
const NAME_COOKIE = "ads_name";
const EMAIL_COOKIE = "ads_email";

export async function getSessionUser() {
  const store = await cookies();
  const role = store.get(ROLE_COOKIE)?.value;
  const name = store.get(NAME_COOKIE)?.value;
  const email = store.get(EMAIL_COOKIE)?.value;

  const safeRole: Role = Roles.includes(role as Role) ? (role as Role) : "VIEWER";

  return {
    role: safeRole,
    name: name ?? "Team Member",
    email: email ?? "viewer@analytics.local",
  };
}

export const sessionCookieKeys = {
  ROLE_COOKIE,
  NAME_COOKIE,
  EMAIL_COOKIE,
};
