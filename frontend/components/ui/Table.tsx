"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { gsap } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils/cn";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div data-animate className="w-full overflow-hidden rounded-2xl border border-white/10">
      <table className={cn("w-full text-left text-sm text-white", className)} {...props} />
    </div>
  );
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-white/5 text-xs uppercase", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  const ref = useRef<HTMLTableRowElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const onEnter = () => {
        gsap.to(ref.current, { backgroundColor: "rgba(255,255,255,0.04)", x: 2, duration: 0.18 });
      };
      const onLeave = () => {
        gsap.to(ref.current, { backgroundColor: "transparent", x: 0, duration: 0.2 });
      };

      ref.current.addEventListener("pointerenter", onEnter);
      ref.current.addEventListener("pointerleave", onLeave);

      return () => {
        ref.current?.removeEventListener("pointerenter", onEnter);
        ref.current?.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref }
  );

  return <tr ref={ref} className={cn("border-b border-white/10", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3", className)} {...props} />;
}

export function TableHeaderCell({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 font-semibold", className)} {...props} />;
}
