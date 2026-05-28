"use client";

import { FilterChips } from "@/components/molecules/filter-chips";
import { SortSelect } from "@/components/molecules/sort-select";

const platformOptions = ["All", "Netflix", "Disney+", "Prime", "Spotify", "YouTube", "Otros"];
const accessTypeOptions = ["Cuenta completa", "Perfil compartido", "Código de activación"];
const sortOptions = [
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "popular", label: "Más vendido" },
];

interface FiltersState {
  platform: string;
  accessType: string;
  sortBy: string;
}

interface FiltersSectionProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

export function FiltersSection({ filters, onFiltersChange }: FiltersSectionProps) {
  return (
    <section className="mb-10 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterChips
          options={platformOptions}
          selected={filters.platform}
          onSelect={(platform) => onFiltersChange({ ...filters, platform })}
        />
        
        <div className="ml-auto">
          <SortSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(sortBy) => onFiltersChange({ ...filters, sortBy })}
          />
        </div>
      </div>

      <FilterChips
        options={accessTypeOptions}
        selected={filters.accessType}
        onSelect={(accessType) => onFiltersChange({ ...filters, accessType })}
      />
    </section>
  );
}

export { platformOptions, accessTypeOptions, sortOptions };
export type { FiltersState };
