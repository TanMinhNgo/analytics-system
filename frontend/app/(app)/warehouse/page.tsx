"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { useDataMarts, useWarehouseTables } from "@/lib/api/hooks";
import { formatDateTime, formatNumber } from "@/lib/utils/format";

export default function WarehousePage() {
  const tablesQuery = useWarehouseTables();
  const martsQuery = useDataMarts();
  const [search, setSearch] = useState("");

  const tables = useMemo(
    () =>
      tablesQuery.data.filter((table) => table.name.toLowerCase().includes(search.toLowerCase())),
    [tablesQuery.data, search]
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Data Warehouse Explorer"
        subtitle="Schema metadata, table health, and data mart catalog."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader title="Core Tables" />
          <div className="my-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table name"
            />
          </div>
          {tables.length === 0 ? (
            <EmptyState title="No matching tables" description="Refine your search query." />
          ) : null}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Table</TableHeaderCell>
                <TableHeaderCell>Columns</TableHeaderCell>
                <TableHeaderCell>Rows</TableHeaderCell>
                <TableHeaderCell>Last Updated</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {tables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell className="font-medium text-foreground">{table.name}</TableCell>
                  <TableCell>{table.columns.length}</TableCell>
                  <TableCell>{formatNumber(table.rowCount)}</TableCell>
                  <TableCell>{formatDateTime(table.lastUpdated)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card>
          <SectionHeader title="Data Marts" subtitle="Available filtered marts" />
          <div className="mt-4 space-y-4">
            {martsQuery.data.map((mart) => (
              <div key={mart.name} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="text-sm font-semibold text-foreground">{mart.name}</div>
                <div className="mt-2 text-xs text-muted-foreground">{mart.description}</div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {formatNumber(mart.rowCount)} rows
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
