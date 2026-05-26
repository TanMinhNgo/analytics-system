"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { useDataMarts, useWarehouseTables } from "@/lib/api/hooks";
import { formatDateTime, formatNumber } from "@/lib/utils/format";

export default function WarehousePage() {
  const tablesQuery = useWarehouseTables();
  const martsQuery = useDataMarts();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Data Warehouse Explorer"
        subtitle="Schema metadata, table health, and data mart catalog."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader title="Core Tables" />
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
              {tablesQuery.data.map((table) => (
                <TableRow key={table.name}>
                  <TableCell className="font-medium text-white">{table.name}</TableCell>
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
              <div key={mart.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">{mart.name}</div>
                <div className="mt-2 text-xs text-(--muted)">{mart.description}</div>
                <div className="mt-3 text-xs text-white/70">{formatNumber(mart.rowCount)} rows</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
