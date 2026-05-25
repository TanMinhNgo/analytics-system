import { cn } from "@/lib/utils/cn";

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
};

export function Toggle({ checked, className, ...props }: ToggleProps) {
  return (
    <button
      className={cn(
        "relative h-7 w-12 rounded-full transition",
        checked ? "bg-(--accent)" : "bg-white/10",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}
