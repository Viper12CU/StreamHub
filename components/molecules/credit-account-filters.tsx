"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"

interface CreditAccountFiltersProps {
  onToggle: () => void
  isOpen: boolean
  onFilterChange: (filters: Record<string, string[]>) => void
  onSortChange: (sort: string) => void
}

function FilterSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
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

const sortOptions = ["Más Recientes", "Mayor Balance", "Menor Balance", "Mayor Gasto", "Nombre"]

export function CreditAccountFilters({ onToggle, isOpen, onFilterChange, onSortChange }: CreditAccountFiltersProps) {
  const [sortBy, setSortBy] = useState("Más Recientes")
  const [balanceRange, setBalanceRange] = useState({ min: "", max: "" })
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true
      return
    }
    const apiFilters: Record<string, string[]> = {}
    if (balanceRange.min || balanceRange.max) {
      apiFilters.balance = [balanceRange.min, balanceRange.max].filter(Boolean)
    }
    onFilterChange(apiFilters)
  }, [balanceRange, onFilterChange])

  useEffect(() => {
    if (!hasFiredRef.current) return
    onSortChange(sortBy)
  }, [sortBy, onSortChange])

  const activeCount = (balanceRange.min ? 1 : 0) + (balanceRange.max ? 1 : 0)

  return (
    <section className="glass rounded-xl overflow-hidden border border-white/5">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() } }}
        aria-expanded={isOpen}
        aria-controls="credit-filters-panel"
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
                setBalanceRange({ min: "", max: "" })
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
        id="credit-filters-panel"
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FilterSection title="Rango de Balance" icon="cash">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={balanceRange.min}
                  onChange={(e) => setBalanceRange({ ...balanceRange, min: e.target.value })}
                  placeholder="Mín"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <span className="text-on-surface-variant/40 text-xs">—</span>
                <input
                  type="number"
                  value={balanceRange.max}
                  onChange={(e) => setBalanceRange({ ...balanceRange, max: e.target.value })}
                  placeholder="Máx"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </FilterSection>

            <FilterSection title="Ordenar Por" icon="arrow-down-up">
              <div className="relative">
                <label htmlFor="credit-sort" className="sr-only">Ordenar cuentas por</label>
                <select
                  id="credit-sort"
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
