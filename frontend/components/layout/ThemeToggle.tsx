"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="group h-10 w-10 rounded-2xl border-border bg-card/70 p-0 text-foreground hover:bg-accent/30"
    >
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="block dark:hidden" />
    </Button>
  );
}
