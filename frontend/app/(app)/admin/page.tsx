"use client";

import { KeyRound, Plus, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { apiClient } from "@/lib/api/client";
import { Roles, roleLabels, type Role } from "@/lib/auth/roles";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt?: string;
};

type UpdateUserPayload = Partial<AdminUser> & {
  password?: string;
};

type CreateUserForm = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

const emptyForm: CreateUserForm = {
  name: "",
  email: "",
  password: "",
  role: "VIEWER",
};

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateUserForm>(emptyForm);
  const [passwordByUserId, setPasswordByUserId] = useState<Record<string, string>>({});

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiClient<AdminUser[]>("/api/v1/users"),
  });

  const createUser = useMutation({
    mutationFn: (payload: CreateUserForm) =>
      apiClient<AdminUser>("/api/v1/users", {
        method: "POST",
        body: JSON.stringify({ ...payload, active: true }),
      }),
    onSuccess: () => {
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User created.");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to create user.");
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      apiClient<AdminUser>(`/api/v1/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, variables) => {
      if (variables.payload.password) {
        setPasswordByUserId((current) => ({ ...current, [variables.id]: "" }));
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User updated.");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to update user.");
    },
  });

  function submitCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createUser.mutate(form);
  }

  function resetPassword(userId: string) {
    const password = passwordByUserId[userId]?.trim();
    if (!password || password.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    updateUser.mutate({
      id: userId,
      payload: { password },
    });
  }

  const users = usersQuery.data ?? [];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Admin Control Center"
        subtitle="Manage users, system health, and audit activity."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { label: "Uptime", value: "99.98%" },
          { label: "DB status", value: "Connected" },
          { label: "Queue depth", value: "14 jobs" },
        ].map((item) => (
          <Card key={item.label}>
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{item.value}</div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHeader title="User Management" subtitle="Create accounts and control access." />
        <form
          onSubmit={submitCreateUser}
          className="mb-6 grid gap-3 lg:grid-cols-[1fr_1fr_150px_150px_auto]"
        >
          <Input
            value={form.name}
            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            placeholder="Full name"
            required
          />
          <Input
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            value={form.password}
            onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
            placeholder="Password"
            type="password"
            required
            minLength={4}
          />
          <Select
            value={form.role}
            onChange={(e) => setForm((current) => ({ ...current, role: e.target.value as Role }))}
          >
            {Roles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={createUser.isPending} className="gap-2 whitespace-nowrap">
            <Plus size={16} />
            {createUser.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Password</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) =>
                      updateUser.mutate({
                        id: user.id,
                        payload: { role: e.target.value as Role },
                      })
                    }
                    className="h-9 rounded-xl"
                  >
                    {Roles.map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.active ? "active" : "paused"} />
                </TableCell>
                <TableCell>
                  <div className="flex min-w-64 gap-2">
                    <Input
                      value={passwordByUserId[user.id] ?? ""}
                      onChange={(e) =>
                        setPasswordByUserId((current) => ({
                          ...current,
                          [user.id]: e.target.value,
                        }))
                      }
                      placeholder="New password"
                      type="password"
                      minLength={4}
                      className="h-9 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 whitespace-nowrap"
                      disabled={updateUser.isPending}
                      onClick={() => resetPassword(user.id)}
                    >
                      <KeyRound size={14} />
                      Reset
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                    disabled={updateUser.isPending}
                    onClick={() =>
                      updateUser.mutate({
                        id: user.id,
                        payload: { active: !user.active },
                      })
                    }
                  >
                    <Save size={14} />
                    {user.active ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {usersQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading users...</TableCell>
              </TableRow>
            ) : null}
            {!usersQuery.isLoading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No users found.</TableCell>
              </TableRow>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
