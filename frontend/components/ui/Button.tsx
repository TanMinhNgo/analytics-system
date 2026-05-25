import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const variantStyles: Record<
  NonNullable<ButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]",
  secondary: "bg-[var(--panel-strong)] text-white hover:bg-[#202435]",
  ghost: "bg-transparent text-white hover:bg-white/10",
  outline: "border border-white/20 text-white hover:border-white/40",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring)",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
