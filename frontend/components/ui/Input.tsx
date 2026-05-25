import { cn } from "@/lib/utils/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white outline-none ring-offset-0 transition focus:border-(--accent) focus:ring-2 focus:ring-(--ring)",
        className
      )}
      {...props}
    />
  );
}
