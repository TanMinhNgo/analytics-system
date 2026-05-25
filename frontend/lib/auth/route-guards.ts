import type { Role } from "./roles";

export function roleCanAccessPath(role: Role, pathname: string) {
  if (pathname.startsWith("/admin")) {
    return role === "ADMIN";
  }

  if (pathname.startsWith("/etl") || pathname.startsWith("/warehouse")) {
    return role === "ADMIN" || role === "DATA_ENGINEER";
  }

  if (pathname.startsWith("/datasources")) {
    return role === "ADMIN" || role === "DATA_ENGINEER";
  }

  if (pathname.startsWith("/analytics")) {
    return role === "ADMIN" || role === "ANALYST" || role === "VIEWER";
  }

  return true;
}
