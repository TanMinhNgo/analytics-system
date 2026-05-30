"use client";

import { Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useUiStore } from "@/lib/store/ui";
import { roleLabels, type Role } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";

type TopbarProps = {
  user?: { name?: string | null; email?: string | null; role?: Role } | null;
};

export default function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const topbarRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!topbarRef.current) return;
      gsap.fromTo(
        topbarRef.current,
        { y: -14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out", clearProps: "all" }
      );
    },
    { scope: topbarRef }
  );

  async function signOut() {
    window.localStorage.removeItem("ads_access_token");
    document.cookie = "ads_role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "ads_name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "ads_email=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    toast.success("Signed out.");
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      ref={topbarRef}
      className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-background/75 px-4 py-4 backdrop-blur md:px-8 md:py-6"
    >
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-2xl border-border bg-card/70 p-0 text-foreground"
          onClick={toggleSidebar}
          type="button"
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <Breadcrumbs />
          <div className="mt-1 truncate text-base font-semibold text-foreground md:text-xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <div className="hidden rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-foreground/80 sm:block">
          {user?.role ? roleLabels[user.role] : "Viewer"}
        </div>
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-2xl border-border bg-card/70 p-0 text-foreground"
          type="button"
        >
          <Bell size={18} />
        </Button>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
