import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const store = await cookies();
  const role = store.get("ads_role")?.value;

  if (!role) {
    redirect("/login");
  }

  if (role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/dashboard");
}
