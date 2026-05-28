"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SortSelect({ options, value, onChange, className }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">Ordenar por:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "bg-[var(--surface-container-high)] border-none text-foreground rounded-lg text-xs font-semibold px-4 py-2 appearance-none pr-8 focus:ring-2 focus:ring-primary",
            className
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-4 h-4" />
      </div>
    </div>
  );
}
