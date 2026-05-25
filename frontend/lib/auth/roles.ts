export const Roles = [
  "ADMIN",
  "DATA_ENGINEER",
  "ANALYST",
  "VIEWER",
] as const;

export type Role = (typeof Roles)[number];

export const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  DATA_ENGINEER: "Data Engineer",
  ANALYST: "Analyst",
  VIEWER: "Viewer",
};
