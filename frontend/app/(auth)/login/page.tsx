"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Roles, roleLabels, type Role } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@analytics.local");
  const [name, setName] = useState("Admin User");
  const [role, setRole] = useState<Role>("ADMIN");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `ads_role=${role}; expires=${expires}; path=/; SameSite=Lax`;
      document.cookie = `ads_name=${encodeURIComponent(name)}; expires=${expires}; path=/; SameSite=Lax`;
      document.cookie = `ads_email=${encodeURIComponent(email)}; expires=${expires}; path=/; SameSite=Lax`;

      const defaultRoute = role === "ADMIN" ? "/admin" : "/dashboard";
      router.push(defaultRoute);
      router.refresh();
      toast.success("Signed in successfully.");
    } catch {
      toast.error("Failed to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-(--muted)">Analytics Access</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {Roles.map((item) => (
              <option key={item} value={item}>
                {roleLabels[item]}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
