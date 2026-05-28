"use client";

import { Chip } from "@/components/atoms/chip";

interface FilterChipsProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip
          key={option}
          active={selected === option}
          onClick={() => onSelect(option)}
        >
          {option}
        </Chip>
      ))}
    </div>
  );
}
