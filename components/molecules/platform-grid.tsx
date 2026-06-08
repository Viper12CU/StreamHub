"use client"

import { memo, useMemo, useCallback } from "react"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { PlatformWithMetrics } from "@/lib/api/platforms"

interface PlatformGridProps {
  activeTab: string
  onSelectPlatform: (id: string) => void
  viewMode: "grid" | "table"
  platforms: PlatformWithMetrics[]
  loading: boolean
  hasActiveFilters?: boolean
}

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activa", variant: "success" },
  inactive: { label: "Inactiva", variant: "warning" },
  archived: { label: "Archivada", variant: "neutral" },
}

function getLetter(name: string) {
  return name.charAt(0).toUpperCase()
}

function getMonthYear(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass rounded-xl border border-white/5 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4" scope="col">Logo</th>
              <th className="py-3" scope="col">Plataforma</th>
              <th className="py-3" scope="col">Categoría</th>
              <th className="py-3" scope="col">Productos</th>
              <th className="py-3" scope="col">Inventario</th>
              <th className="py-3" scope="col">Ingresos</th>
              <th className="py-3" scope="col">Estado</th>
              <th className="py-3" scope="col">Creada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4"><Skeleton className="w-8 h-8 rounded-lg" /></td>
                <td className="py-3"><Skeleton className="h-4 w-28" /></td>
                <td className="py-3"><Skeleton className="h-4 w-16" /></td>
                <td className="py-3"><Skeleton className="h-4 w-8" /></td>
                <td className="py-3"><Skeleton className="h-4 w-10" /></td>
                <td className="py-3"><Skeleton className="h-4 w-14" /></td>
                <td className="py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="py-3"><Skeleton className="h-3 w-16" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmptyState({ hasActiveFilters }: { hasActiveFilters?: boolean }) {
  return (
    <div className="glass rounded-xl p-12 border border-white/5 text-center">
      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">
        {hasActiveFilters ? "filter_list_off" : "smart_display"}
      </span>
      <p className="text-sm text-on-surface-variant">
        {hasActiveFilters ? "No se encontraron plataformas con estos filtros" : "No hay plataformas registradas"}
      </p>
      {hasActiveFilters && (
        <p className="text-[10px] text-on-surface-variant/60 mt-1">Intenta ajustar los filtros de búsqueda</p>
      )}
    </div>
  )
}

function PlatformGridInner({ activeTab, onSelectPlatform, viewMode, platforms, loading, hasActiveFilters }: PlatformGridProps) {
  const filteredPlatforms = useMemo(() => {
    return activeTab === "all"
      ? platforms
      : platforms.filter((p) => p.status === activeTab)
  }, [platforms, activeTab])

  const handleRowKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelectPlatform(id)
    }
  }, [onSelectPlatform])

  if (loading) {
    return viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />
  }

  if (filteredPlatforms.length === 0) {
    return <EmptyState hasActiveFilters={hasActiveFilters} />
  }

  if (viewMode === "table") {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Lista de plataformas">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="py-3 px-4" scope="col">Logo</th>
                <th className="py-3" scope="col">Plataforma</th>
                <th className="py-3" scope="col">Categoría</th>
                <th className="py-3" scope="col">Productos</th>
                <th className="py-3" scope="col">Inventario</th>
                <th className="py-3" scope="col">Ingresos</th>
                <th className="py-3" scope="col">Estado</th>
                <th className="py-3" scope="col">Creada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPlatforms.map((platform) => (
                <tr
                  key={platform.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => onSelectPlatform(platform.id)}
                  onKeyDown={(e) => handleRowKeyDown(e, platform.id)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
                >
                  <td className="py-3 px-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black italic"
                      style={{ backgroundColor: platform.color }}
                    >
                      {getLetter(platform.name)}
                    </div>
                  </td>
                  <td className="py-3 text-xs font-medium text-on-surface">{platform.name}</td>
                  <td className="py-3 text-xs text-on-surface-variant capitalize">{platform.category}</td>
                  <td className="py-3 text-xs text-on-surface">{platform.products_count}</td>
                  <td className="py-3 text-xs text-on-surface">{platform.inventory_available}</td>
                  <td className="py-3 text-xs font-semibold text-primary">${(platform.revenue_monthly ?? 0).toLocaleString()}</td>
                  <td className="py-3">
                    <StatusBadge status={statusMap[platform.status]?.label || platform.status} variant={statusMap[platform.status]?.variant || "neutral"} />
                  </td>
                  <td className="py-3 text-[10px] text-on-surface-variant">{getMonthYear(platform.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredPlatforms.map((platform) => (
        <div
          key={platform.id}
          tabIndex={0}
          role="button"
          onClick={() => onSelectPlatform(platform.id)}
          onKeyDown={(e) => handleRowKeyDown(e, platform.id)}
          className="glass rounded-xl border border-white/5 p-4 hover:bg-white/[0.03] transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black italic shadow-lg"
                style={{ backgroundColor: platform.color }}
              >
                {getLetter(platform.name)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface">{platform.name}</h3>
                <p className="text-[10px] text-on-surface-variant capitalize">{platform.category}</p>
              </div>
            </div>
            <StatusBadge status={statusMap[platform.status]?.label || platform.status} variant={statusMap[platform.status]?.variant || "neutral"} />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-surface-container-low rounded-lg">
              <p className="text-[10px] text-on-surface-variant uppercase">Productos</p>
              <p className="text-sm font-bold text-on-surface">{platform.products_count}</p>
            </div>
            <div className="text-center p-2 bg-surface-container-low rounded-lg">
              <p className="text-[10px] text-on-surface-variant uppercase">Inventario</p>
              <p className="text-sm font-bold text-on-surface">{platform.inventory_available}</p>
            </div>
            <div className="text-center p-2 bg-surface-container-low rounded-lg">
              <p className="text-[10px] text-on-surface-variant uppercase">Ingresos</p>
              <p className="text-sm font-bold text-primary">${(platform.revenue_monthly ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const PlatformGrid = memo(PlatformGridInner)
