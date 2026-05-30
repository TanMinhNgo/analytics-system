import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-2xl border border-border bg-card/70 px-4 pr-10 text-sm text-foreground outline-none transition [color-scheme:dark] focus:border-(--accent) focus:ring-2 focus:ring-(--ring) [&>option]:bg-slate-900 [&>option]:text-white",
          className
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
        <ChevronDown size={16} />
      </span>
    </div>
  );
}
