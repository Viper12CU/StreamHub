"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface PlatformFiltersProps {
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
        <Icon name={icon} size={"md"} className=" text-on-surface-variant opacity-60" />
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  )
}

const statuses = ["Activa", "Inactiva", "Archivada"]
const categories = ["Streaming", "Música", "Video", "IPTV", "Software", "VPN", "AI Tools", "Gaming", "Otro"]
const sortOptions = ["Nombre", "Ingresos", "Productos", "Inventario", "Más Reciente"]

const statusApiMap: Record<string, string> = {
  "Activa": "active",
  "Inactiva": "inactive",
  "Archivada": "archived",
}

const categoryApiMap: Record<string, string> = {
  "Streaming": "streaming",
  "Música": "musica",
  "Video": "video",
  "IPTV": "iptv",
  "Software": "software",
  "VPN": "vpn",
  "AI Tools": "ai_tools",
  "Gaming": "gaming",
  "Otro": "otro",
}

export function PlatformFilters({ onToggle, isOpen, onFilterChange, onSortChange }: PlatformFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState("Nombre")
  const hasFiredRef = useRef(false)

  const toggleFilter = useCallback((category: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [category]: updated }
    })
  }, [])

  useEffect(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true
      return
    }
    const apiFilters: Record<string, string[]> = {}
    if (activeFilters.status?.length) {
      apiFilters.status = activeFilters.status.map((s) => statusApiMap[s] || s)
    }
    if (activeFilters.category?.length) {
      apiFilters.category = activeFilters.category.map((c) => categoryApiMap[c] || c)
    }
    onFilterChange(apiFilters)
  }, [activeFilters, onFilterChange])

  useEffect(() => {
    if (!hasFiredRef.current) return
    onSortChange(sortBy)
  }, [sortBy, onSortChange])

  const activeCount = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <section className="glass rounded-xl overflow-hidden border border-white/5">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() } }}
        aria-expanded={isOpen}
        aria-controls="platform-filters-panel"
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="filter-variant" size="lg" className="text-primary" />
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
              onClick={(e) => { e.stopPropagation(); setActiveFilters({}) }}
              className="text-[11px] text-primary font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Limpiar
            </button>
          )}
          <Icon name="chevron-down" className={cn(
            "text-on-surface-variant transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </div>

      <div
        id="platform-filters-panel"
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          <FilterSection title="Estado" icon="flag">
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <FilterChip key={s} label={s} active={activeFilters.status?.includes(s)} onClick={() => toggleFilter("status", s)} />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Categoría" icon="category">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <FilterChip key={c} label={c} active={activeFilters.category?.includes(c)} onClick={() => toggleFilter("category", c)} />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Ordenar Por" icon="sort">
            <div className="relative">
              <label htmlFor="platform-sort" className="sr-only">Ordenar plataformas por</label>
              <select
                id="platform-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
            </div>
          </FilterSection>
        </div>
      </div>
    </section>
  )
}
