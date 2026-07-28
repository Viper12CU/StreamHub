"use client";

import { SearchInput } from "@/components/atoms/search-input";
import { FilterChips, type FilterChipOption } from "@/components/molecules/filter-chips";
import { SortSelect } from "@/components/molecules/sort-select";

const accessTypeOptions = ["Cuenta completa", "Perfil compartido", "Código de activación"];
const sortOptions = [
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
];

interface FiltersState {
  search: string;
  platform: string;
  accessType: string;
  sortBy: string;
}

interface FiltersSectionProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  platformOptions: FilterChipOption[];
}

export function FiltersSection({ filters, onFiltersChange, platformOptions }: FiltersSectionProps) {
  return (
    <section className="mb-10 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <SearchInput
            type="search"
            value={filters.search}
            onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
            placeholder="Buscar producto, plataforma o descripción"
            aria-label="Buscar productos"
          />
        </div>

        <div className="ml-auto">
          <SortSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(sortBy) => onFiltersChange({ ...filters, sortBy })}
          />
        </div>
      </div>

      <FilterChips
        options={platformOptions}
        selected={filters.platform}
        onSelect={(platform) => onFiltersChange({ ...filters, platform })}
      />

      <FilterChips
        options={accessTypeOptions}
        selected={filters.accessType}
        onSelect={(accessType) => onFiltersChange({ ...filters, accessType })}
      />
    </section>
  );
}

export { accessTypeOptions, sortOptions };
export type { FiltersState };
