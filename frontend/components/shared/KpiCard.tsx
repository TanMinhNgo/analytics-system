import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { formatNumber, formatPercent } from "@/lib/utils/format";

type KpiCardProps = {
  label: string;
  value: number;
  change: number;
  isPercent?: boolean;
};

export function KpiCard({ label, value, change, isPercent }: KpiCardProps) {
  const formattedValue = isPercent ? formatPercent(value) : formatNumber(value);

  return (
    <Card className="space-y-3">
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-3xl">{formattedValue}</CardTitle>
      <div className="text-xs text-muted-foreground">
        {change >= 0 ? "+" : ""}
        {formatPercent(change)} vs last period
      </div>
    </Card>
  );
}
