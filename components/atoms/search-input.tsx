"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
        <input
          ref={ref}
          className={cn(
            "w-full rounded-full glass-panel border border-white/10 bg-background/40 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
