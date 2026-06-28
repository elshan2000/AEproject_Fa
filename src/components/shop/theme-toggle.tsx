"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Toggles the `dark` class on <html> and persists the choice in localStorage.
 * The initial class is set before paint by the inline script in layout.tsx;
 * this mirrors/updates it. Renders a stable icon until mounted (no mismatch).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore storage errors (e.g. private mode) */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted && dark ? "حالت روشن" : "حالت تاریک"}
      className={cn("transition-opacity hover:opacity-60", className)}
    >
      {mounted && dark ? (
        <Sun strokeWidth={1.5} className="h-5 w-5" />
      ) : (
        <Moon strokeWidth={1.5} className="h-5 w-5" />
      )}
    </button>
  );
}
