"use client"

import { cn } from "@/lib/utils";

interface DurationButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DurationButton({ label, isSelected = false, onClick, className }: DurationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-200",
        isSelected 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-card text-foreground border-transparent hover:border-border",
        className
      )}
    >
      {label}
    </button>
  );
}
