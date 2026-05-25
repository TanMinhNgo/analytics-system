import { StatusBadge } from "@/components/shared/StatusBadge";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { formatDateTime, formatDuration, formatNumber } from "@/lib/utils/format";
import type { EtlJob } from "@/types/etl";

export function RecentJobsTable({ jobs }: { jobs: EtlJob[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Job</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Duration</TableHeaderCell>
          <TableHeaderCell>Rows</TableHeaderCell>
          <TableHeaderCell>Started</TableHeaderCell>
        </TableRow>
      </TableHead>
      <tbody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium text-white">{job.name}</TableCell>
            <TableCell>
              <StatusBadge status={job.status} />
            </TableCell>
            <TableCell>{formatDuration(job.durationMs)}</TableCell>
            <TableCell>{formatNumber(job.rowsProcessed)}</TableCell>
            <TableCell>{formatDateTime(job.startedAt)}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
