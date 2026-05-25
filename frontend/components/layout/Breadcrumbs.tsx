"use client";

import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-xs text-(--muted)">
      <span>Home</span>
      {segments.map((segment, index) => (
        <span key={`${segment}-${index}`} className="flex items-center gap-2">
          <span className="text-white/40">/</span>
          <span className="capitalize">{segment.replace(/-/g, " ")}</span>
        </span>
      ))}
    </div>
  );
}
