"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface OfferFiltersProps {
  onToggle: () => void
  isOpen: boolean
  onFilterChange: (filters: Record<string, string[]>) => void
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

const offerTypes = [
  { label: "Descuento (%)", value: "discount" },
  { label: "Combo", value: "combo" },
]

const sortOptions = [
  { label: "Más Recientes", value: "newest" },
  { label: "Más Antiguas", value: "oldest" },
  { label: "Título A-Z", value: "title_asc" },
  { label: "Título Z-A", value: "title_desc" },
]

export function OfferFilters({ onToggle, isOpen, onFilterChange }: OfferFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      const next = { ...prev, [category]: updated }
      onFilterChange(next)
      return next
    })
  }

  const activeCount = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0)
    + (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0)

  const handleClear = () => {
    setActiveFilters({})
    setDateRange({ start: "", end: "" })
    onFilterChange({})
  }

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
            <span className="text-sm font-semibold text-on-surface">Filtros Avanzados</span>
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
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="text-[11px] text-primary font-medium hover:underline"
            >
              Limpiar
            </button>
          )}
          <Icon name="chevron-down" className={cn(
            "text-on-surface-variant text-sm transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          {/* Offer Type */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Icon name="tag" className="text-xs text-on-surface-variant opacity-60" />
              <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Tipo de Oferta</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {offerTypes.map((type) => (
                <FilterChip
                  key={type.value}
                  label={type.label}
                  active={activeFilters.type?.includes(type.value)}
                  onClick={() => toggleFilter("type", type.value)}
                />
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Icon name="calendar" className="text-xs text-on-surface-variant opacity-60" />
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Fecha de Inicio</p>
              </div>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Icon name="calendar-end" className="text-xs text-on-surface-variant opacity-60" />
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Fecha de Fin</p>
              </div>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
