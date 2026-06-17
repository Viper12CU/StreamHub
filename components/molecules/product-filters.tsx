"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import { usePlatforms } from "@/hooks/use-platforms"

interface ProductFiltersProps {
  onToggle: () => void
  isOpen: boolean
  onFilterChange: (filters: Record<string, string[]>) => void
  onSortChange: (sort: string) => void
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
        <Icon name={icon} className="text-xs text-on-surface-variant opacity-60" />
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  )
}

const productTypeMap: Record<string, string> = {
  "Cuenta Completa": "full_account",
  "Perfil Compartido": "shared_profile",
  "Código de Activación": "activation_code",
  "Paquete de Suscripción": "subscription_package",
}

const statusMap: Record<string, string> = {
  "Activo": "active",
  "Borrador": "draft",
  "Archivado": "archived",
  "Sin Stock": "out_of_stock",
}

const inventoryMap: Record<string, string> = {
  "En Stock": "available",
  "Stock Bajo": "assigned",
  "Sin Stock": "sold",
}

const productTypes = [
  { name: "Cuenta Completa", icon: "account" },
  { name: "Perfil Compartido", icon: "account-group" },
  { name: "Código de Activación", icon: "key" },
  { name: "Paquete de Suscripción", icon: "package-variant-closed" },
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

const sortOptions: { label: string; value: string }[] = [
  { label: "Más Reciente", value: "created" },
  { label: "Nombre", value: "name" },
  { label: "Ingresos", value: "revenue" },
  { label: "Inventario", value: "inventory" },
  { label: "Precio", value: "price" },
]

export function ProductFilters({ onToggle, isOpen, onFilterChange, onSortChange }: ProductFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("created")
  const { platforms } = usePlatforms()
  const [hasFired, setHasFired] = useState(false)

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
    if (!hasFired) {
      setHasFired(true)
      return
    }
    const apiFilters: Record<string, string[]> = {}
    if (activeFilters.platform?.length) {
      const selectedPlatforms = platforms.filter((p) => activeFilters.platform?.includes(p.name))
      if (selectedPlatforms.length > 0) {
        apiFilters.platform_id = selectedPlatforms.map((p) => p.id)
      }
    }
    if (activeFilters.type?.length) {
      apiFilters.product_type = activeFilters.type.map((t) => productTypeMap[t] || t)
    }
    if (activeFilters.status?.length) {
      apiFilters.status = activeFilters.status.map((s) => statusMap[s] || s)
    }
    if (activeFilters.inventory?.length) {
      apiFilters.inventory_status = activeFilters.inventory.map((i) => inventoryMap[i] || i)
    }
    if (priceRange.min) apiFilters.price_min = [priceRange.min]
    if (priceRange.max) apiFilters.price_max = [priceRange.max]
    onFilterChange(apiFilters)
  }, [activeFilters, priceRange, platforms, onFilterChange, hasFired])

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value)
    onSortChange(value)
  }, [onSortChange])

  const handleClear = useCallback(() => {
    setActiveFilters({})
    setPriceRange({ min: "", max: "" })
  }, [])

  const activeCount = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0)
    + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0)

  return (
    <section className="glass rounded-xl overflow-hidden">
      {/* Toggle Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() } }}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
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
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="text-[11px] text-primary font-medium hover:underline focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
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
      </div>

      {/* Filter Content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4 space-y-5 border-t border-white/5 pt-4">
          {/* Platform */}
          <FilterSection title="Plataforma" icon="television">
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => toggleFilter("platform", platform.name)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 border",
                    activeFilters.platform?.includes(platform.name)
                      ? "bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/10"
                      : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high hover:border-white/10"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />
                  {platform.name}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Product Type */}
          <FilterSection title="Tipo de Producto" icon="shape-outline">
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
                  <Icon name={type.icon} className="text-xs opacity-60" />
                  {type.name}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Status & Inventory - Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FilterSection title="Estado" icon="flag-outline">
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
            <FilterSection title="Rango de Precio" icon="credit-card-outline">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Mín"
                    aria-label="Precio mínimo"
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
                    aria-label="Precio máximo"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 bg-surface-container-low border border-white/5 rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Ordenar Por" icon="sort">
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">Ordenar productos por</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-lg text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
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
