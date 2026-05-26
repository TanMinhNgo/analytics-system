import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import type { Role } from "@/lib/auth/roles";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const role = "VIEWER" as Role;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 space-y-8 px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
