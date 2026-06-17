"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import type { InventoryWithDetails } from "@/lib/api/inventory"

interface InventoryTableProps {
  items: InventoryWithDetails[]
  loading: boolean
  pagination: { page: number; totalPages: number; total: number }
  selectedAssets: string[]
  onSelectAssets: (ids: string[]) => void
  onViewAsset: (id: string) => void
  onPageChange: (page: number) => void
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "neutral" | "error" }> = {
  available: { label: "Disponible", variant: "success" },
  reserved: { label: "Reservado", variant: "warning" },
  assigned: { label: "Asignado", variant: "neutral" },
  expired: { label: "Expirado", variant: "error" },
  suspended: { label: "Suspendido", variant: "error" },
}

const assetTypeLabels: Record<string, string> = {
  account: "Cuenta Completa",
  profile: "Perfil Compartido",
  code: "Código de Activación",
  package: "Paquete de Suscripción",
}

function TableSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4 w-10"><Skeleton className="h-4 w-4 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-10 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-12 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-24 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-14 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
              <th className="py-3 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4 w-10"><Skeleton className="h-4 w-4 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-16 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-20 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-24 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-32 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-28 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-20 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-20 rounded" /></td>
                <td className="py-3 px-3"><Skeleton className="h-4 w-16 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="glass rounded-xl p-12 border border-white/5 text-center">
      <Icon name="package-variant-closed" className="text-4xl text-on-surface-variant/30 mb-3" />
      <p className="text-sm text-on-surface-variant">No hay activos en el inventario</p>
      <p className="text-xs text-on-surface-variant/60 mt-1">Crea tu primer activo para comenzar</p>
    </div>
  )
}

function getExpirationStyle(days: number | null) {
  if (days === null) return "text-error"
  if (days <= 7) return "text-error font-bold"
  if (days <= 15) return "text-amber-500 font-semibold"
  return "text-on-surface-variant"
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "N/A"
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
  } catch {
    return "N/A"
  }
}

export function InventoryTable({ items, loading, pagination, selectedAssets, onSelectAssets, onViewAsset, onPageChange }: InventoryTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      onSelectAssets([])
    } else {
      onSelectAssets(items.map((a) => a.id))
    }
    setSelectAll(!selectAll)
  }, [selectAll, items, onSelectAssets])

  const handleSelectAsset = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = selectedAssets.includes(id)
      ? selectedAssets.filter((aid) => aid !== id)
      : [...selectedAssets, id]
    onSelectAssets(updated)
  }, [selectedAssets, onSelectAssets])

  if (loading) return <TableSkeleton />
  if (items.length === 0) return <EmptyState />

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-base font-semibold text-on-surface">Activos Digitales</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos los activos de esta página"
                  className="w-4 h-4 rounded accent-primary"
                />
              </th>
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">Plataforma</th>
              <th className="py-3 px-3">Tipo</th>
              <th className="py-3 px-3">Producto</th>
              <th className="py-3 px-3">Identificador</th>
              <th className="py-3 px-3">Estado</th>
              <th className="py-3 px-3">Cliente</th>
              <th className="py-3 px-3">Expiración</th>
              <th className="py-3 px-3">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onViewAsset(item.id)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(item.id)}
                    onChange={(e) => handleSelectAsset(e, item.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Seleccionar ${item.identifier}`}
                    className="w-4 h-4 rounded accent-primary"
                  />
                </td>
                <td className="py-3 px-3 text-xs font-semibold text-primary whitespace-nowrap">{item.id.slice(0, 8)}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.platform_color || "#666" }}
                    />
                    <span className="text-xs text-on-surface-variant">{item.platform_name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs text-on-surface-variant whitespace-nowrap">
                  {assetTypeLabels[item.metadata?.asset_type] || item.metadata?.asset_type || "N/A"}
                </td>
                <td className="py-3 px-3 text-xs text-on-surface max-w-[150px] truncate">{item.product_name}</td>
                <td className="py-3 px-3 text-xs text-on-surface-variant font-mono whitespace-nowrap">{item.identifier}</td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <StatusBadge
                    status={statusMap[item.status]?.label || item.status}
                    variant={statusMap[item.status]?.variant || "neutral"}
                  />
                </td>
                <td className="py-3 px-3 text-xs text-on-surface-variant whitespace-nowrap">
                  {item.customer_name || <span className="opacity-40">Sin asignar</span>}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant">{formatDate(item.expires_at)}</span>
                    {item.days_remaining !== null && (
                      <span className={cn("text-[10px]", getExpirationStyle(item.days_remaining))}>
                        {item.days_remaining} días
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-[10px] text-on-surface-variant whitespace-nowrap">{formatDate(item.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">
          Mostrando {items.length} de {pagination.total} activos
        </span>
        {pagination.totalPages > 1 && (
          <nav className="flex gap-1" aria-label="Paginación de inventario">
            {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                aria-label={`Ir a página ${i + 1}`}
                aria-current={pagination.page === i + 1 ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors",
                  pagination.page === i + 1
                    ? "bg-primary text-white"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
