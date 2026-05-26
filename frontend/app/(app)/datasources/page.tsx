"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { Toggle } from "@/components/ui/Toggle";
import { useDataSources } from "@/lib/api/hooks";
import { formatDateTime } from "@/lib/utils/format";

export default function DataSourcesPage() {
  const dataSourcesQuery = useDataSources();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Data Sources"
          subtitle="Manage connectors, credentials, and ingestion health."
        />
        <Button>Add data source</Button>
      </div>
      <Card>
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
            {dataSourcesQuery.data.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium text-white">{source.name}</TableCell>
                <TableCell>{source.type}</TableCell>
                <TableCell>
                  <StatusBadge status={source.status} />
                </TableCell>
                <TableCell>{formatDateTime(source.lastSync)}</TableCell>
                <TableCell>
                  <Toggle checked={source.enabled} aria-label="toggle" />
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
