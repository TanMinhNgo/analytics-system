"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";

export default function AnimatedMain({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!rootRef.current) return;

      const targets = gsap.utils.toArray<HTMLElement>(
        rootRef.current.querySelectorAll("[data-animate]")
      );

      targets.forEach((target, index) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            delay: Math.min(index * 0.03, 0.18),
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: target,
              start: "top 86%",
              once: true,
            },
          }
        );
      });
    },
    { scope: rootRef, dependencies: [pathname] }
  );

  return (
    <main ref={rootRef} className="flex-1 space-y-8 px-8 py-10">
      {children}
    </main>
  );
}
