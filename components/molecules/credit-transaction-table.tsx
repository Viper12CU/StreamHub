"use client"

import { useState, useEffect, useCallback } from "react"
import { Icon } from "@/components/atoms/icon"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getCreditTransactions,
  type CreditTransactionWithUser,
  type CreditTransactionType,
  type PaginationMeta,
} from "@/lib/api/credits"
import { getRelativeDate } from "@/lib/constants/shared"

interface CreditTransactionTableProps {
  refreshKey?: number
}

const transactionTypeMap: Record<CreditTransactionType, { label: string; variant: "success" | "error" | "warning" | "neutral" | "info" }> = {
  admin_grant: { label: "Otorgado", variant: "success" },
  admin_deduct: { label: "Deducido", variant: "error" },
  adjustment: { label: "Ajuste", variant: "info" },
  purchase: { label: "Compra", variant: "warning" },
  refund: { label: "Reembolso", variant: "success" },
}

const typeFilters: { id: string; label: string; icon: string }[] = [
  { id: "all", label: "Todas", icon: "swap-horizontal" },
  { id: "admin_grant", label: "Otorgados", icon: "arrow-down" },
  { id: "admin_deduct", label: "Deducidos", icon: "arrow-up" },
  { id: "adjustment", label: "Ajustes", icon: "tune" },
  { id: "purchase", label: "Compras", icon: "cart" },
  { id: "refund", label: "Reembolsos", icon: "refresh" },
]

export function CreditTransactionTable({ refreshKey }: CreditTransactionTableProps) {
  const [transactions, setTransactions] = useState<CreditTransactionWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, totalPages: 1, total: 0 })
  const [activeType, setActiveType] = useState("all")

  const fetchTransactions = useCallback(async (page = 1, type?: string) => {
    try {
      setLoading(true)
      const filters: { type?: CreditTransactionType } = {}
      if (type && type !== "all") filters.type = type as CreditTransactionType
      const result = await getCreditTransactions(filters, page, 15)
      setTransactions(result.data)
      setPagination(result.pagination)
    } catch {
      // Non-critical
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions(1, activeType)
  }, [activeType, refreshKey, fetchTransactions])

  if (loading && transactions.length === 0) {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="py-3 px-4" scope="col">Tipo</th>
                <th className="py-3" scope="col">Usuario</th>
                <th className="py-3" scope="col">Monto</th>
                <th className="py-3" scope="col">Balance</th>
                <th className="py-3" scope="col">Razón</th>
                <th className="py-3" scope="col">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="py-3"><Skeleton className="h-3 w-24" /></td>
                  <td className="py-3"><Skeleton className="h-3 w-14" /></td>
                  <td className="py-3"><Skeleton className="h-3 w-14" /></td>
                  <td className="py-3"><Skeleton className="h-3 w-20" /></td>
                  <td className="py-3"><Skeleton className="h-3 w-16" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-base font-semibold text-on-surface">Historial de Transacciones</h3>
        <div className="flex gap-1 overflow-x-auto custom-scrollbar">
          {typeFilters.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setActiveType(tf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold rounded-full transition-all whitespace-nowrap ${
                activeType === tf.id
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-surface-container-low text-on-surface-variant border border-white/5 hover:bg-surface-container-high"
              }`}
            >
              <Icon name={tf.icon} className="text-xs" />
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center">
          <Icon name="swap-horizontal" className="text-3xl text-on-surface-variant/30 mb-2 block mx-auto" />
          <p className="text-xs text-on-surface-variant">No hay transacciones de este tipo</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Historial de transacciones de crédito">
              <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
                <tr>
                  <th className="py-3 px-4" scope="col">Tipo</th>
                  <th className="py-3" scope="col">Usuario</th>
                  <th className="py-3" scope="col">Monto</th>
                  <th className="py-3" scope="col">Balance Antes → Después</th>
                  <th className="py-3" scope="col">Razón</th>
                  <th className="py-3" scope="col">Admin</th>
                  <th className="py-3" scope="col">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => {
                  const typeInfo = transactionTypeMap[tx.type] || { label: tx.type, variant: "neutral" as const }
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4">
                        <StatusBadge status={typeInfo.label} variant={typeInfo.variant} />
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-on-surface">{tx.user_name || "—"}</span>
                          <span className="text-[10px] text-on-surface-variant">{tx.user_email || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs font-bold ${
                          tx.type === "admin_grant" || tx.type === "refund" ? "text-green-400" : "text-red-400"
                        }`}>
                          {tx.type === "admin_grant" || tx.type === "refund" ? "+" : "-"}${Number(tx.amount ?? 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-on-surface-variant">
                        ${Number(tx.balance_before ?? 0).toFixed(2)} → ${Number(tx.balance_after ?? 0).toFixed(2)}
                      </td>
                      <td className="py-3 text-[10px] text-on-surface-variant max-w-[150px] truncate">{tx.reason || "—"}</td>
                      <td className="py-3 text-[10px] text-on-surface-variant">{tx.admin_name || "—"}</td>
                      <td className="py-3 text-[10px] text-on-surface-variant">{getRelativeDate(tx.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                {transactions.length} de {pagination.total.toLocaleString()} transacciones
              </span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchTransactions(i + 1, activeType)}
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
        </>
      )}
    </div>
  )
}
