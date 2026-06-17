"use client"

import { memo, useCallback } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Customer } from "@/lib/api/customers"

interface CustomerTableProps {
  activeTab: string
  onSelectCustomer: (id: string) => void
  viewMode: "grid" | "table"
  customers: Customer[]
  loading: boolean
  hasActiveFilters?: boolean
  pagination?: { page: number; totalPages: number; total: number }
  onPageChange?: (page: number) => void
}

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  vip: { label: "VIP", variant: "warning" },
  inactive: { label: "Inactivo", variant: "neutral" },
  suspended: { label: "Suspendido", variant: "error" },
}

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-amber-500/20 text-amber-500",
  "bg-purple-500/20 text-purple-400",
  "bg-green-500/20 text-green-400",
]

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function getRelativeDate(dateStr: string | null) {
  if (!dateStr) return "Nunca"
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Hoy"
  if (days === 1) return "Ayer"
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem`
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`
  return `Hace ${Math.floor(days / 365)} años`
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
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
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
              <th className="py-3 px-4 w-10" scope="col">
                <Skeleton className="w-4 h-4 rounded" />
              </th>
              <th className="py-3" scope="col">Cliente</th>
              <th className="py-3" scope="col">ID</th>
              <th className="py-3" scope="col">Órdenes</th>
              <th className="py-3" scope="col">Valor Vida</th>
              <th className="py-3" scope="col">Suscripciones</th>
              <th className="py-3" scope="col">Última Compra</th>
              <th className="py-3" scope="col">Estado</th>
              <th className="py-3" scope="col">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4"><Skeleton className="w-4 h-4 rounded" /></td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                </td>
                <td className="py-3"><Skeleton className="h-3 w-24" /></td>
                <td className="py-3"><Skeleton className="h-3 w-8" /></td>
                <td className="py-3"><Skeleton className="h-3 w-14" /></td>
                <td className="py-3"><Skeleton className="h-3 w-8" /></td>
                <td className="py-3"><Skeleton className="h-3 w-16" /></td>
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
      <Icon name={hasActiveFilters ? "filter-off" : "account-group"} className="text-4xl text-on-surface-variant/30 mb-3 block" />
      <p className="text-sm text-on-surface-variant">
        {hasActiveFilters ? "No se encontraron clientes con estos filtros" : "No hay clientes registrados"}
      </p>
      {hasActiveFilters && (
        <p className="text-[10px] text-on-surface-variant/60 mt-1">Intenta ajustar los filtros de búsqueda</p>
      )}
    </div>
  )
}

function CustomerTableInner({
  activeTab,
  onSelectCustomer,
  viewMode,
  customers,
  loading,
  hasActiveFilters,
  pagination,
  onPageChange,
}: CustomerTableProps) {
  const handleRowKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelectCustomer(id)
    }
  }, [onSelectCustomer])

  if (loading) {
    return viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />
  }

  if (customers.length === 0) {
    return <EmptyState hasActiveFilters={hasActiveFilters} />
  }

  if (viewMode === "table") {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-on-surface">Directorio de Clientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Lista de clientes">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="py-3 px-4 w-10" />
                <th className="py-3" scope="col">Cliente</th>
                <th className="py-3" scope="col">ID</th>
                <th className="py-3" scope="col">Órdenes</th>
                <th className="py-3" scope="col">Valor Vida</th>
                <th className="py-3" scope="col">Suscripciones</th>
                <th className="py-3" scope="col">Última Compra</th>
                <th className="py-3" scope="col">Estado</th>
                <th className="py-3" scope="col">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((customer, i) => (
                <tr
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer.id)}
                  onKeyDown={(e) => handleRowKeyDown(e, customer.id)}
                  tabIndex={0}
                  role="button"
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
                >
                  <td className="py-3 px-4 w-10">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                      avatarColors[i % avatarColors.length]
                    )}>
                      {getInitials(customer.name)}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">{customer.name}</span>
                      <span className="text-[10px] text-on-surface-variant">{customer.email}</span>
                    </div>
                  </td>
                  <td className="py-3 text-[10px] font-semibold text-primary">{customer.id}</td>
                  <td className="py-3 text-xs text-on-surface">{customer.total_orders}</td>
                  <td className="py-3 text-xs font-semibold text-on-surface">${Number(customer.lifetime_value ?? 0).toFixed(2)}</td>
                  <td className="py-3 text-xs text-on-surface-variant">{customer.active_subscriptions}</td>
                  <td className="py-3 text-[10px] text-on-surface-variant">
                    {customer.last_purchase === "Nunca" || !customer.last_purchase ? (
                      <span className="opacity-40">Nunca</span>
                    ) : (
                      getRelativeDate(customer.last_purchase)
                    )}
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      status={statusMap[customer.status]?.label || customer.status}
                      variant={statusMap[customer.status]?.variant || "neutral"}
                    />
                  </td>
                  <td className="py-3 text-[10px] text-on-surface-variant">{getMonthYear(customer.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Mostrando {customers.length} de {pagination.total.toLocaleString()} clientes
            </span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange?.(i + 1)}
                  className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${
                    pagination.page === i + 1
                      ? "bg-primary text-white"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-on-surface">Directorio de Clientes</h3>
        <span className="text-xs text-on-surface-variant">{customers.length} de {pagination?.total ?? customers.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {customers.map((customer, i) => (
        <div
          key={customer.id}
          tabIndex={0}
          role="button"
          onClick={() => onSelectCustomer(customer.id)}
          onKeyDown={(e) => handleRowKeyDown(e, customer.id)}
          className="glass rounded-xl border border-white/5 p-4 hover:bg-white/[0.03] transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
              avatarColors[i % avatarColors.length]
            )}>
              {getInitials(customer.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-on-surface truncate">{customer.name}</h3>
              <p className="text-[10px] text-on-surface-variant truncate">{customer.email}</p>
            </div>
            <StatusBadge
              status={statusMap[customer.status]?.label || customer.status}
              variant={statusMap[customer.status]?.variant || "neutral"}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-surface-container-low rounded-lg">
              <p className="text-[10px] text-on-surface-variant uppercase">Órdenes</p>
              <p className="text-sm font-bold text-on-surface mt-1">{customer.total_orders}</p>
            </div>
            <div className="text-center p-2 bg-surface-container-low rounded-lg">
              <p className="text-[10px] text-on-surface-variant uppercase">Valor Vida</p>
              <p className="text-sm font-bold text-primary">${Number(customer.lifetime_value ?? 0).toFixed(2)}</p>
            </div>
            <div className="text-center p-2 bg-surface-container-low rounded-lg">
              <p className="text-[10px] text-on-surface-variant uppercase">Activos</p>
              <p className="text-sm font-bold text-on-surface">{customer.active_subscriptions}</p>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export const CustomerTable = memo(CustomerTableInner)
