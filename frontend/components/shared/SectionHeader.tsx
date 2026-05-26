import { cn } from "@/lib/utils/cn";

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {subtitle ? <p className="text-sm text-(--muted)">{subtitle}</p> : null}
    </div>
  );
}
