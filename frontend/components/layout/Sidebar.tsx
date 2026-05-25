"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Database,
  FileText,
  Gauge,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils/cn";
import type { Role } from "@/lib/auth/roles";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: "all" | Role[];
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, roles: "all" },
  { label: "Data Sources", href: "/datasources", icon: Database, roles: ["ADMIN", "DATA_ENGINEER"] },
  { label: "ETL Monitor", href: "/etl", icon: Activity, roles: ["ADMIN", "DATA_ENGINEER"] },
  { label: "Warehouse", href: "/warehouse", icon: Gauge, roles: ["ADMIN", "DATA_ENGINEER"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3, roles: ["ADMIN", "ANALYST", "VIEWER"] },
  { label: "Reports", href: "/analytics", icon: FileText, roles: ["ADMIN", "ANALYST", "VIEWER"] },
  { label: "Admin", href: "/admin", icon: Settings, roles: ["ADMIN"] },
] satisfies NavItem[];

function canAccess(item: NavItem, role: Role) {
  if (item.roles === "all") {
    return true;
  }

  return item.roles.includes(role);
}

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-white/10 bg-black/40 px-4 py-8 backdrop-blur",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="mb-10 px-2">
        <div className="text-xs uppercase tracking-[0.3em] text-(--muted)">
          Atlas
        </div>
        <div className="mt-2 text-lg font-semibold text-white">Analytics Core</div>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems
          .filter((item) => canAccess(item, role))
          .map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10",
                  isActive && "bg-white/15 text-white"
                )}
              >
                <Icon size={18} />
                {sidebarOpen ? item.label : null}
              </Link>
            );
          })}
      </nav>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-(--muted)">
        Upgrade data refresh to 15s cadence.
      </div>
    </aside>
  );
}
