"use client"

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function FaqItem({ question, answer, defaultOpen = false, className }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("glass-panel rounded-xl overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-base">{question}</span>
        <ChevronDown className={cn(
          "w-5 h-5 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-muted-foreground text-sm border-t border-border">
          <p className="pt-4">{answer}</p>
        </div>
      )}
    </div>
  );
}
