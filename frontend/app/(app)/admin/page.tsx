import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";

const users = [
  { name: "Ava Admin", role: "ADMIN", status: "active" },
  { name: "Ethan Engineer", role: "DATA_ENGINEER", status: "active" },
  { name: "Nora Analyst", role: "ANALYST", status: "active" },
];

export default function AdminPage() {
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
            <div className="text-sm text-(--muted)">{item.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {item.value}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHeader title="User Management" />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell className="font-medium text-white">
                  {user.name}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
