"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { gsap } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const onEnter = () => {
        gsap.to(ref.current, {
          y: -4,
          boxShadow: "0 18px 38px rgba(0,0,0,0.35)",
          duration: 0.22,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(ref.current, {
          y: 0,
          boxShadow: "0 0 30px rgba(0,0,0,0.25)",
          duration: 0.24,
          ease: "power2.out",
        });
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

  return (
    <div
      ref={ref}
      data-animate
      className={cn(
        "rounded-2xl border border-white/10 bg-(--panel) p-6 shadow-[0_0_30px_rgba(0,0,0,0.25)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-white", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
