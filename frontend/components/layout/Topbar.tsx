"use client";

import { Bell, Menu } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useUiStore } from "@/lib/store/ui";
import { roleLabels, type Role } from "@/lib/auth/roles";

type TopbarProps = {
  user?: { name?: string | null; email?: string | null; role?: Role } | null;
};

export default function Topbar({ user }: TopbarProps) {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="flex items-center justify-between border-b border-white/10 px-8 py-6">
      <div className="flex items-center gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
          onClick={toggleSidebar}
          type="button"
        >
          <Menu size={18} />
        </button>
        <div>
          <Breadcrumbs />
          <div className="mt-1 text-xl font-semibold text-white">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          {user?.role ? roleLabels[user.role] : "Viewer"}
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
          type="button"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
