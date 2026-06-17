"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"

interface CustomerFiltersProps {
  onToggle: () => void
  isOpen: boolean
  onFilterChange: (filters: Record<string, string[]>) => void
  onSortChange: (sort: string) => void
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

const sortOptions = ["Más Recientes", "Mayor Valor", "Más Órdenes", "Reciente Activo", "Nombre"]

export function CustomerFilters({ onToggle, isOpen, onFilterChange, onSortChange }: CustomerFiltersProps) {
  const [sortBy, setSortBy] = useState("Más Recientes")
  const [registrationRange, setRegistrationRange] = useState({ start: "", end: "" })
  const [lifetimeValue, setLifetimeValue] = useState({ min: "", max: "" })
  const [totalOrders, setTotalOrders] = useState({ min: "", max: "" })
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true
      return
    }
    const apiFilters: Record<string, string[]> = {}
    if (registrationRange.start || registrationRange.end) {
      apiFilters.registration = [registrationRange.start, registrationRange.end].filter(Boolean)
    }
    if (lifetimeValue.min || lifetimeValue.max) {
      apiFilters.lifetime_value = [lifetimeValue.min, lifetimeValue.max].filter(Boolean)
    }
    if (totalOrders.min || totalOrders.max) {
      apiFilters.total_orders = [totalOrders.min, totalOrders.max].filter(Boolean)
    }
    onFilterChange(apiFilters)
  }, [registrationRange, lifetimeValue, totalOrders, onFilterChange])

  useEffect(() => {
    if (!hasFiredRef.current) return
    onSortChange(sortBy)
  }, [sortBy, onSortChange])

  const activeCount = (registrationRange.start ? 1 : 0) + (registrationRange.end ? 1 : 0)
    + (lifetimeValue.min ? 1 : 0) + (lifetimeValue.max ? 1 : 0)
    + (totalOrders.min ? 1 : 0) + (totalOrders.max ? 1 : 0)

  return (
    <section className="glass rounded-xl overflow-hidden border border-white/5">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() } }}
        aria-expanded={isOpen}
        aria-controls="customer-filters-panel"
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none cursor-pointer"
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
              onClick={(e) => {
                e.stopPropagation()
                setRegistrationRange({ start: "", end: "" })
                setLifetimeValue({ min: "", max: "" })
                setTotalOrders({ min: "", max: "" })
              }}
              className="text-[11px] text-primary font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Limpiar
            </button>
          )}
          <Icon
            name="unfold-more"
            className={cn(
              "text-on-surface-variant text-sm transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      <div
        id="customer-filters-panel"
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FilterSection title="Fecha de Registro" icon="calendar-today">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={registrationRange.start}
                  onChange={(e) => setRegistrationRange({ ...registrationRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <span className="text-on-surface-variant/40 text-xs">—</span>
                <input
                  type="date"
                  value={registrationRange.end}
                  onChange={(e) => setRegistrationRange({ ...registrationRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </FilterSection>

            <FilterSection title="Valor de Vida" icon="currency-usd">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={lifetimeValue.min}
                  onChange={(e) => setLifetimeValue({ ...lifetimeValue, min: e.target.value })}
                  placeholder="Mín"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <span className="text-on-surface-variant/40 text-xs">—</span>
                <input
                  type="number"
                  value={lifetimeValue.max}
                  onChange={(e) => setLifetimeValue({ ...lifetimeValue, max: e.target.value })}
                  placeholder="Máx"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </FilterSection>

            <FilterSection title="Total Órdenes" icon="receipt">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={totalOrders.min}
                  onChange={(e) => setTotalOrders({ ...totalOrders, min: e.target.value })}
                  placeholder="Mín"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <span className="text-on-surface-variant/40 text-xs">—</span>
                <input
                  type="number"
                  value={totalOrders.max}
                  onChange={(e) => setTotalOrders({ ...totalOrders, max: e.target.value })}
                  placeholder="Máx"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </FilterSection>

            <FilterSection title="Ordenar Por" icon="arrow-down-up">
              <div className="relative">
                <label htmlFor="customer-sort" className="sr-only">Ordenar clientes por</label>
                <select
                  id="customer-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                >
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
