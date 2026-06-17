"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface InventoryFiltersProps {
  onToggle: () => void
  isOpen: boolean
  platforms?: Array<{ name: string; color?: string | null }>
  onFilterChange?: (filters: Record<string, string[]>) => void
}

function FilterChip({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 border",
        active
          ? "bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/10"
          : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high hover:border-white/10"
      )}
    >
      {label}
    </button>
  )
}

interface FilterSectionProps {
  title: string
  icon: string
  children: React.ReactNode
}

function FilterSection({ title, icon, children }: FilterSectionProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Icon name={icon} className="text-xs text-on-surface-variant opacity-60" />
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  )
}

const statuses = ["Disponible", "Reservado", "Asignado", "Expirado", "Suspendido"]
const sortOptions = ["Reciente", "Fecha de Expiración", "Plataforma", "Estado"]

export function InventoryFilters({ onToggle, isOpen, platforms = [], onFilterChange }: InventoryFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      const newFilters = { ...prev, [category]: updated }
      onFilterChange?.(newFilters)
      return newFilters
    })
  }

  const clearFilters = () => {
    setActiveFilters({})
    onFilterChange?.({})
  }

  const activeCount = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <section className="glass rounded-xl overflow-hidden border border-white/5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="filter-variant" className="text-primary text-sm" />
          </div>
          <div>
            <span className="text-sm font-semibold text-on-surface">Filtros</span>
            {activeCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">
                {activeCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); clearFilters() }}
              className="text-[11px] text-primary font-medium hover:underline"
            >
              Limpiar
            </button>
          )}
          <Icon
            name="chevron-down"
            className={cn(
              "text-on-surface-variant text-sm transition-transform duration-200",
              isOpen && "rotate-180"
            )}/>
        </div>
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          {/* Platform */}
          <FilterSection title="Plataforma" icon="television">
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => toggleFilter("platform", platform.name)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 border",
                    activeFilters.platform?.includes(platform.name)
                      ? "bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/10"
                      : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high hover:border-white/10"
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platform.color || "#666" }}
                  />
                  {platform.name}
                </button>
              ))}
              {platforms.length === 0 && (
                <span className="text-[11px] text-on-surface-variant opacity-60">Cargando plataformas...</span>
              )}
            </div>
          </FilterSection>

          {/* Status */}
            <FilterSection title="Estado" icon="flag-outline">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <FilterChip
                  key={status}
                  label={status}
                  active={activeFilters.status?.includes(status)}
                  onClick={() => toggleFilter("status", status)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Date Range & Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FilterSection title="Fecha de Expiración" icon="calendar-outline">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <span className="text-on-surface-variant/40 text-xs">—</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </FilterSection>

            <FilterSection title="Ordenar Por" icon="sort">
              <div className="relative">
                <select className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer">
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </section>
  )
}
