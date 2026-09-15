"use client"

import { memo, useCallback } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { CreditAccountWithUser } from "@/lib/api/credits"
import { getInitials, getRelativeDate, getMonthYear } from "@/lib/constants/shared"

interface CreditAccountTableProps {
  onSelectAccount: (userId: string) => void
  viewMode: "grid" | "table"
  accounts: CreditAccountWithUser[]
  loading: boolean
  hasActiveFilters?: boolean
  pagination?: { page: number; totalPages: number; total: number }
  onPageChange?: (page: number) => void
}

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-amber-500/20 text-amber-500",
  "bg-purple-500/20 text-purple-400",
  "bg-green-500/20 text-green-400",
]

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
              <th className="py-3 px-4 w-10" scope="col" />
              <th className="py-3" scope="col">Usuario</th>
              <th className="py-3" scope="col">Balance</th>
              <th className="py-3" scope="col">Total Otorgado</th>
              <th className="py-3" scope="col">Total Gastado</th>
              <th className="py-3" scope="col">Última Actualización</th>
              <th className="py-3" scope="col">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4"><Skeleton className="w-8 h-8 rounded-full" /></td>
                <td className="py-3">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </td>
                <td className="py-3"><Skeleton className="h-3 w-14" /></td>
                <td className="py-3"><Skeleton className="h-3 w-14" /></td>
                <td className="py-3"><Skeleton className="h-3 w-14" /></td>
                <td className="py-3"><Skeleton className="h-3 w-16" /></td>
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
      <Icon name={hasActiveFilters ? "filter-off" : "cash"} className="text-4xl text-on-surface-variant/30 mb-3 block" />
      <p className="text-sm text-on-surface-variant">
        {hasActiveFilters ? "No se encontraron cuentas con estos filtros" : "No hay cuentas de crédito registradas"}
      </p>
      {hasActiveFilters && (
        <p className="text-[10px] text-on-surface-variant/60 mt-1">Intenta ajustar los filtros de búsqueda</p>
      )}
    </div>
  )
}

function CreditAccountTableInner({
  onSelectAccount,
  viewMode,
  accounts,
  loading,
  hasActiveFilters,
  pagination,
  onPageChange,
}: CreditAccountTableProps) {
  const handleRowKeyDown = useCallback((e: React.KeyboardEvent, userId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelectAccount(userId)
    }
  }, [onSelectAccount])

  if (loading) {
    return viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />
  }

  if (accounts.length === 0) {
    return <EmptyState hasActiveFilters={hasActiveFilters} />
  }

  if (viewMode === "table") {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-on-surface">Cuentas de Crédito</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Lista de cuentas de crédito">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="py-3 px-4 w-10" />
                <th className="py-3" scope="col">Usuario</th>
                <th className="py-3" scope="col">Balance</th>
                <th className="py-3" scope="col">Total Otorgado</th>
                <th className="py-3" scope="col">Total Gastado</th>
                <th className="py-3" scope="col">Última Actualización</th>
                <th className="py-3" scope="col">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {accounts.map((account, i) => (
                <tr
                  key={account.id}
                  onClick={() => onSelectAccount(account.customer_id)}
                  onKeyDown={(e) => handleRowKeyDown(e, account.customer_id)}
                  tabIndex={0}
                  role="button"
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
                >
                  <td className="py-3 px-4 w-10">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                      avatarColors[i % avatarColors.length]
                    )}>
                      {getInitials(account.user_name || "U")}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">{account.user_name || "Sin nombre"}</span>
                      <span className="text-[10px] text-on-surface-variant">{account.user_email || "—"}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      status={`$${Number(account.balance ?? 0).toFixed(2)}`}
                      variant={account.balance > 0 ? "success" : "neutral"}
                    />
                  </td>
                  <td className="py-3 text-xs text-on-surface">${Number(account.lifetime_credited ?? 0).toFixed(2)}</td>
                  <td className="py-3 text-xs text-on-surface-variant">${Number(account.lifetime_spent ?? 0).toFixed(2)}</td>
                  <td className="py-3 text-[10px] text-on-surface-variant">{getRelativeDate(account.updated_at)}</td>
                  <td className="py-3 text-[10px] text-on-surface-variant">{getMonthYear(account.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Mostrando {accounts.length} de {pagination.total.toLocaleString()} cuentas
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
        <h3 className="text-base font-semibold text-on-surface">Cuentas de Crédito</h3>
        <span className="text-xs text-on-surface-variant">{accounts.length} de {pagination?.total ?? accounts.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {accounts.map((account, i) => (
          <div
            key={account.id}
            tabIndex={0}
            role="button"
            onClick={() => onSelectAccount(account.customer_id)}
            onKeyDown={(e) => handleRowKeyDown(e, account.customer_id)}
            className="glass rounded-xl border border-white/5 p-4 hover:bg-white/[0.03] transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                avatarColors[i % avatarColors.length]
              )}>
                {getInitials(account.user_name || "U")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-on-surface truncate">{account.user_name || "Sin nombre"}</h3>
                <p className="text-[10px] text-on-surface-variant truncate">{account.user_email || "—"}</p>
              </div>
              <StatusBadge
                status={account.balance > 0 ? "Con Saldo" : "Sin Saldo"}
                variant={account.balance > 0 ? "success" : "neutral"}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase">Balance</p>
                <p className="text-sm font-bold text-green-400 mt-1">${Number(account.balance ?? 0).toFixed(2)}</p>
              </div>
              <div className="text-center p-2 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase">Otorgado</p>
                <p className="text-sm font-bold text-blue-400 mt-1">${Number(account.lifetime_credited ?? 0).toFixed(2)}</p>
              </div>
              <div className="text-center p-2 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase">Gastado</p>
                <p className="text-sm font-bold text-amber-500 mt-1">${Number(account.lifetime_spent ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const CreditAccountTable = memo(CreditAccountTableInner)
