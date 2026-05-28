"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, active = false, onClick, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full glass-panel text-xs font-semibold tracking-wide transition-colors",
        active
          ? "bg-primary/20 text-primary border-primary/30"
          : "hover:bg-white/5",
        className
      )}
    >
      {children}
    </button>
  );
}
