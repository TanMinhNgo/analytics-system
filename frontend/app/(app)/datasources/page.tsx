"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { Toggle } from "@/components/ui/Toggle";
import { apiClient } from "@/lib/api/client";
import { useDataSources } from "@/lib/api/hooks";
import { formatDateTime } from "@/lib/utils/format";
import type { DataSource, DataSourceType } from "@/types/datasource";

const dataSourceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["ERP", "POS", "LEGACY", "EXTERNAL", "OLTP"]),
  config: z.record(z.string()).default({}),
});

type DataSourceFormValues = z.infer<typeof dataSourceSchema>;
const configFieldsByType: Record<DataSourceType, string[]> = {
  ERP: ["host", "database", "port", "schema"],
  POS: ["host", "database", "port", "version"],
  LEGACY: ["host", "database", "port", "adapter"],
  EXTERNAL: ["apiEndpoint", "apiVersion", "tokenRef"],
  OLTP: ["host", "database", "port", "username"],
};

export default function DataSourcesPage() {
  const queryClient = useQueryClient();
  const dataSourcesQuery = useDataSources();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DataSource | null>(null);
  const form = useForm<DataSourceFormValues>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: { name: "", type: "ERP", config: {} },
  });
  const selectedType = useWatch({ control: form.control, name: "type" });
  const configValues = useWatch({ control: form.control, name: "config" });

  const rows = useMemo(() => {
    return dataSourcesQuery.data.filter((source) => {
      const matchSearch = source.name.toLowerCase().includes(search.toLowerCase());
      const matchType = type === "ALL" ? true : source.type === type;
      return matchSearch && matchType;
    });
  }, [dataSourcesQuery.data, search, type]);

  async function testConnection() {
    try {
      await apiClient("/api/v1/datasources");
      toast.success("Connection to backend API is healthy.");
    } catch {
      toast.error("Backend is unavailable right now.");
    }
  }

  const createMutation = useMutation({
    mutationFn: (payload: DataSourceFormValues) =>
      apiClient("/api/v1/datasources", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      toast.success("Data source created.");
      await queryClient.invalidateQueries({ queryKey: ["datasources"] });
      setModalOpen(false);
      form.reset({ name: "", type: "ERP", config: {} });
    },
    onError: () => toast.error("Failed to create data source."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DataSourceFormValues }) =>
      apiClient(`/api/v1/datasources/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      toast.success("Data source updated.");
      await queryClient.invalidateQueries({ queryKey: ["datasources"] });
      setModalOpen(false);
      setEditing(null);
      form.reset({ name: "", type: "ERP", config: {} });
    },
    onError: () => toast.error("Failed to update data source."),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      apiClient(`/api/v1/datasources/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ enabled }),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["datasources"] });
    },
    onError: () => toast.error("Failed to update source status."),
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", type: "ERP", config: {} });
    setModalOpen(true);
  }

  function openEdit(source: DataSource) {
    setEditing(source);
    form.reset({
      name: source.name,
      type: source.type as DataSourceType,
      config: Object.fromEntries(
        Object.entries(source.config ?? {}).map(([key, value]) => [key, String(value)])
      ),
    });
    setModalOpen(true);
  }

  const isMutating =
    createMutation.isPending || updateMutation.isPending || toggleMutation.isPending;

  const onSubmit = form.handleSubmit((values) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values });
      return;
    }
    createMutation.mutate(values);
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Data Sources"
          subtitle="Manage connectors, credentials, and ingestion health."
        />
        <div className="flex gap-3">
          <Button variant="outline" onClick={testConnection}>
            Test connection
          </Button>
          <Button onClick={openCreate}>Add data source</Button>
        </div>
      </div>
      {modalOpen ? (
        <Card className="space-y-4 border-(--accent)/40">
          <SectionHeader
            title={editing ? "Edit Data Source" : "Add Data Source"}
            subtitle="Provide connector metadata and source type."
          />
          <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Input placeholder="Source name" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="mt-1 text-xs text-red-300">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div>
              <Select {...form.register("type")}>
                <option value="ERP">ERP</option>
                <option value="POS">POS</option>
                <option value="LEGACY">Legacy</option>
                <option value="EXTERNAL">External</option>
                <option value="OLTP">OLTP</option>
              </Select>
            </div>
            {configFieldsByType[selectedType ?? "ERP"].map((field) => (
              <div key={field}>
                <Input
                  placeholder={field}
                  value={configValues?.[field] ?? ""}
                  onChange={(e) =>
                    form.setValue("config", { ...(configValues ?? {}), [field]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="md:col-span-3 flex gap-3">
              <Button type="submit" disabled={isMutating}>
                {editing ? "Save changes" : "Create source"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  setEditing(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by source name"
          />
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="ALL">All types</option>
            <option value="ERP">ERP</option>
            <option value="POS">POS</option>
            <option value="LEGACY">Legacy</option>
            <option value="EXTERNAL">External</option>
            <option value="OLTP">OLTP</option>
          </Select>
        </div>
        {rows.length === 0 ? (
          <EmptyState
            title="No data sources found"
            description="Try a different filter or search term."
          />
        ) : null}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last Sync</TableHeaderCell>
              <TableHeaderCell>Enabled</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {rows.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium text-white">{source.name}</TableCell>
                <TableCell>{source.type}</TableCell>
                <TableCell>
                  <StatusBadge status={source.status} />
                </TableCell>
                <TableCell>{formatDateTime(source.lastSync)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Toggle
                      checked={source.enabled}
                      aria-label="toggle"
                      onClick={() =>
                        toggleMutation.mutate({ id: source.id, enabled: !source.enabled })
                      }
                    />
                    <Button variant="ghost" size="sm" onClick={() => openEdit(source)}>
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
