"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Icon } from "@/components/atoms/icon"
import { formatDate } from "@/lib/constants/shared"
import {
  creditTransactionLabels,
  creditTransactionColors,
  creditTransactionIcons,
} from "@/lib/constants/shared"
import { getMyCreditTransactions, type MyCreditTransaction } from "@/lib/api/account"

const ITEMS_PER_PAGE = 10

export function CreditTransactionTable() {
  const [transactions, setTransactions] = useState<MyCreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    getMyCreditTransactions(page, ITEMS_PER_PAGE)
      .then((res) => {
        setTransactions(res.data)
        setTotalPages(res.pagination.totalPages)
        setTotal(res.pagination.total)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  if (loading) {
    return (
      <GlassCard className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-[var(--surface-container)] animate-pulse" />
        ))}
      </GlassCard>
    )
  }

  if (transactions.length === 0) {
    return (
      <GlassCard className="p-12 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center">
          <Icon name="cash-multiple" className="text-[28px] text-[var(--on-surface-variant)]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Sin movimientos</h3>
          <p className="text-sm text-[var(--on-surface-variant)] max-w-sm">
            Aún no hay transacciones en tu cuenta de créditos. Recarga para empezar a comprar.
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Historial de Transacciones</h3>
        <span className="text-xs text-[var(--on-surface-variant)]">{total} movimientos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--on-surface-variant)]">
              <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wider">Fecha</th>
              <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wider">Tipo</th>
              <th className="text-right px-6 py-3 font-medium text-xs uppercase tracking-wider">Monto</th>
              <th className="text-right px-6 py-3 font-medium text-xs uppercase tracking-wider">Antes</th>
              <th className="text-right px-6 py-3 font-medium text-xs uppercase tracking-wider">Después</th>
              <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wider">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 text-[var(--on-surface-variant)] whitespace-nowrap">
                  {formatDate(tx.created_at)}
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${creditTransactionColors[tx.type] || "text-[var(--on-surface-variant)]"}`}>
                    <Icon name={creditTransactionIcons[tx.type] || "circle"} className="text-[14px]" />
                    {creditTransactionLabels[tx.type] || tx.type}
                  </span>
                </td>
                <td className={`px-6 py-3 text-right font-semibold whitespace-nowrap ${
                  tx.type === "admin_grant" || tx.type === "refund"
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {tx.type === "admin_grant" || tx.type === "refund" ? "+" : "-"}${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right text-[var(--on-surface-variant)] whitespace-nowrap">
                  ${tx.balance_before.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right font-medium whitespace-nowrap">
                  ${tx.balance_after.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-[var(--on-surface-variant)] max-w-[200px] truncate">
                  {tx.reason || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs text-[var(--on-surface-variant)] hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="chevron-left" className="text-[16px]" />
            Anterior
          </button>
          <span className="text-xs text-[var(--on-surface-variant)]">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs text-[var(--on-surface-variant)] hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
            <Icon name="chevron-right" className="text-[16px]" />
          </button>
        </div>
      )}
    </GlassCard>
  )
}
