import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-border bg-card/70 px-4 text-sm text-foreground outline-none ring-offset-0 transition placeholder:text-muted-foreground focus:border-(--accent) focus:ring-2 focus:ring-(--ring)",
        className
      )}
      {...props}
    />
  );
}
