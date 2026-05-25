import { cn } from "@/lib/utils/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "success" | "warning" | "error" | "info" | "neutral";
};

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-emerald-500/20 text-emerald-200",
  warning: "bg-amber-500/20 text-amber-200",
  error: "bg-rose-500/20 text-rose-200",
  info: "bg-sky-500/20 text-sky-200",
  neutral: "bg-white/10 text-white/80",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
