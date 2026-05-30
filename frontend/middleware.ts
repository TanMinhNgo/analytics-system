import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Roles, type Role } from "@/lib/auth/roles";
import { roleCanAccessPath } from "@/lib/auth/route-guards";

const protectedPrefixes = ["/dashboard", "/datasources", "/etl", "/warehouse", "/analytics", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!needsAuth) {
    return NextResponse.next();
  }

  const roleCookie = req.cookies.get("ads_role")?.value;
  if (!roleCookie || !Roles.includes(roleCookie as Role)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = roleCookie as Role;
  if (!roleCanAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/datasources/:path*", "/etl/:path*", "/warehouse/:path*", "/analytics/:path*", "/admin/:path*"],
};
