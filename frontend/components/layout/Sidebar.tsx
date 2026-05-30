"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Activity,
  BarChart3,
  Database,
  FileText,
  Gauge,
  LayoutGrid,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";

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
  {
    label: "Data Sources",
    href: "/datasources",
    icon: Database,
    roles: ["ADMIN", "DATA_ENGINEER"],
  },
  { label: "ETL Monitor", href: "/etl", icon: Activity, roles: ["ADMIN", "DATA_ENGINEER"] },
  { label: "Warehouse", href: "/warehouse", icon: Gauge, roles: ["ADMIN", "DATA_ENGINEER"] },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["ADMIN", "ANALYST", "VIEWER"],
  },
  { label: "Reports", href: "/reports", icon: FileText, roles: ["ADMIN", "ANALYST", "VIEWER"] },
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
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const sidebarRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sidebarRef.current) return;
      gsap.fromTo(
        sidebarRef.current,
        { x: -20, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out", clearProps: "all" }
      );
    },
    { scope: sidebarRef }
  );

  useGSAP(
    () => {
      if (!sidebarRef.current) return;

      const labels = sidebarRef.current.querySelectorAll("[data-sidebar-label]");
      const navItemsEls = sidebarRef.current.querySelectorAll("[data-sidebar-item]");
      const badge = sidebarRef.current.querySelector("[data-sidebar-badge]");
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
        gsap.to(sidebarRef.current, {
          width: sidebarOpen ? 256 : 80,
          duration: 0.28,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }

      gsap.to(labels, {
        autoAlpha: sidebarOpen ? 1 : 0,
        x: sidebarOpen ? 0 : -6,
        duration: 0.22,
        ease: "power2.out",
      });

      gsap.fromTo(
        navItemsEls,
        { x: -8, autoAlpha: 0.85 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.28,
          stagger: 0.03,
          ease: "power2.out",
          overwrite: "auto",
        }
      );

      if (badge) {
        gsap.fromTo(
          badge,
          { y: 6, autoAlpha: 0.85 },
          { y: 0, autoAlpha: 1, duration: 0.22, ease: "power2.out", overwrite: "auto" }
        );
      }
    },
    { scope: sidebarRef, dependencies: [sidebarOpen, pathname] }
  );

  useEffect(() => {
    const syncForViewport = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    syncForViewport();
    window.addEventListener("resize", syncForViewport);
    return () => window.removeEventListener("resize", syncForViewport);
  }, [setSidebarOpen]);

  const closeOnMobileOnly = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/45 transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-black/65 px-4 py-6 backdrop-blur md:sticky md:top-0 md:z-10 md:h-screen md:bg-black/40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:w-64"
        )}
      >
        <div className="mb-6 px-2">
          <div data-sidebar-label className="text-xs uppercase tracking-[0.3em] text-white/60">
            {sidebarOpen ? "Atlas" : "A"}
          </div>
          <div
            data-sidebar-label
            className={cn(
              "mt-2 text-lg font-semibold text-white transition-opacity",
              sidebarOpen ? "opacity-100" : "opacity-0 md:hidden"
            )}
          >
            Analytics Core
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {navItems
            .filter((item) => canAccess(item, role))
            .map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  data-sidebar-item
                  key={item.label}
                  href={item.href}
                  onClick={closeOnMobileOnly}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10",
                    isActive && "bg-white/15 text-white"
                  )}
                >
                  <Icon size={18} />
                  {sidebarOpen ? item.label : null}
                </Link>
              );
            })}
        </nav>
        <div
          data-sidebar-badge
          className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-white/75"
        >
          {sidebarOpen ? (
            "Upgrade data refresh to 15s cadence."
          ) : (
            <div className="flex justify-center">
              <Sparkles size={16} aria-label="refresh upgrade hint" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
