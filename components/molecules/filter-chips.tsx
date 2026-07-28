"use client";

import { Chip } from "@/components/atoms/chip";

export type FilterChipOption = string | { value: string; label: string };

interface FilterChipsProps {
  options: FilterChipOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={typeof option === "string" ? option : option.value}
          active={selected === (typeof option === "string" ? option : option.value)}
          onClick={() => onSelect(typeof option === "string" ? option : option.value)}
        >
          {typeof option === "string" ? option : option.label}
        </Chip>
      ))}
    </div>
  );
}
