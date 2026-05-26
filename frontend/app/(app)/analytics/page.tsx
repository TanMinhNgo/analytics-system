import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { dataMarts } from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics & Reports"
        subtitle="Build custom reports and visualize metrics."
      />
      <Card className="space-y-6">
        <SectionHeader title="Report Builder" />
        <div className="grid gap-4 md:grid-cols-3">
          <Select>
            {dataMarts.map((mart) => (
              <option key={mart.name} value={mart.name}>
                {mart.name}
              </option>
            ))}
          </Select>
          <Select>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Quarterly</option>
          </Select>
          <Select>
            <option>Line chart</option>
            <option>Bar chart</option>
            <option>Table</option>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Button>Run report</Button>
          <Button variant="outline">Export CSV</Button>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Latest Results" />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Dimension</TableHeaderCell>
              <TableHeaderCell>Metric</TableHeaderCell>
              <TableHeaderCell>Trend</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {[
              { dimension: "Northeast", metric: "12.4%", trend: "Up 4%" },
              { dimension: "Midwest", metric: "10.1%", trend: "Down 1%" },
              { dimension: "South", metric: "9.8%", trend: "Up 2%" },
            ].map((row) => (
              <TableRow key={row.dimension}>
                <TableCell className="font-medium text-white">{row.dimension}</TableCell>
                <TableCell>{row.metric}</TableCell>
                <TableCell>{row.trend}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
