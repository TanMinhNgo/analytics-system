import { cn } from "@/lib/utils/cn";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white outline-none transition [color-scheme:dark] focus:border-(--accent) focus:ring-2 focus:ring-(--ring) [&>option]:bg-slate-900 [&>option]:text-white",
        className
      )}
      {...props}
    />
  );
}
