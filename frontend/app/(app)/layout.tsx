import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AnimatedMain from "@/components/layout/AnimatedMain";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={user.role} />
      <div className="flex min-h-0 flex-1 flex-col">
        <Topbar user={user} />
        <AnimatedMain>{children}</AnimatedMain>
      </div>
    </div>
  );
}
