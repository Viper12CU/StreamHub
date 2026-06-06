"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  onToggle: () => void
  isOpen: boolean
}

interface FilterChipProps {
  label: string
  active?: boolean
  onClick: () => void
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
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
        <span className="material-symbols-outlined text-xs text-on-surface-variant opacity-60">{icon}</span>
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  )
}

const platforms = [
  { name: "Netflix", color: "bg-primary-container" },
  { name: "Disney+", color: "bg-tertiary" },
  { name: "Spotify", color: "bg-secondary" },
  { name: "YouTube Premium", color: "bg-[#ff0000]" },
  { name: "HBO Max", color: "bg-[#b829e3]" },
  { name: "Crunchyroll", color: "bg-[#f47521]" },
  { name: "IPTV", color: "bg-amber-500" },
  { name: "Otro", color: "bg-surface-container-highest" },
]

const productTypes = [
  { name: "Cuenta Completa", icon: "person" },
  { name: "Perfil Compartido", icon: "group" },
  { name: "Código de Activación", icon: "vpn_key" },
  { name: "Paquete de Suscripción", icon: "inventory_2" },
]

const statuses = [
  { name: "Activo", color: "text-green-400" },
  { name: "Borrador", color: "text-on-surface-variant" },
  { name: "Archivado", color: "text-on-surface-variant" },
  { name: "Sin Stock", color: "text-error" },
]

const inventoryStatus = [
  { name: "En Stock", color: "text-green-400" },
  { name: "Stock Bajo", color: "text-amber-500" },
  { name: "Sin Stock", color: "text-error" },
]

const sortOptions = ["Más Vendido", "Más Reciente", "Ingresos", "Inventario", "Nombre"]

export function ProductFilters({ onToggle, isOpen }: ProductFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("Más Vendido")

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [category]: updated }
    })
  }

  const activeCount = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <section className="glass rounded-xl overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">filter_alt</span>
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
              className="text-[11px] text-primary font-medium hover:underline"
            >
              Limpiar
            </button>
          )}
          <span className={cn(
            "material-symbols-outlined text-on-surface-variant text-sm transition-transform duration-200",
            isOpen && "rotate-180"
          )}>
            expand_more
          </span>
        </div>
      </button>

      {/* Filter Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          {/* Platform */}
          <FilterSection title="Plataforma" icon="smart_display">
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
                  <span className={cn("w-2 h-2 rounded-full", platform.color)} />
                  {platform.name}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Product Type */}
          <FilterSection title="Tipo de Producto" icon="category">
            <div className="flex flex-wrap gap-2">
              {productTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() => toggleFilter("type", type.name)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 border",
                    activeFilters.type?.includes(type.name)
                      ? "bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/10"
                      : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high hover:border-white/10"
                  )}
                >
                  <span className="material-symbols-outlined text-xs opacity-60">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Status & Inventory - Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FilterSection title="Estado" icon="flag">
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <FilterChip
                    key={status.name}
                    label={status.name}
                    active={activeFilters.status?.includes(status.name)}
                    onClick={() => toggleFilter("status", status.name)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Inventario" icon="warehouse">
              <div className="flex flex-wrap gap-2">
                {inventoryStatus.map((status) => (
                  <FilterChip
                    key={status.name}
                    label={status.name}
                    active={activeFilters.inventory?.includes(status.name)}
                    onClick={() => toggleFilter("inventory", status.name)}
                  />
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Price Range & Sort - Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FilterSection title="Rango de Precio" icon="payments">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 bg-surface-container-low border border-white/5 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
                <span className="text-on-surface-variant/40 text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 bg-surface-container-low border border-white/5 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Ordenar Por" icon="sort">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-lg text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none">
                  unfold_more
                </span>
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </section>
  )
}
