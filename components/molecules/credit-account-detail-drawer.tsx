"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/atoms/icon"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getCreditAccountById,
  getCreditTransactionsByUser,
  type CreditAccountWithUser,
  type CreditTransactionWithUser,
  type PaginationMeta,
} from "@/lib/api/credits"
import { formatDateFull, getRelativeDate } from "@/lib/constants/shared"

interface CreditAccountDetailDrawerProps {
  customerId: string
  onClose: () => void
  onRefresh: () => void
}

const transactionTypeMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" | "info" }> = {
  admin_grant: { label: "Otorgado", variant: "success" },
  admin_deduct: { label: "Deducido", variant: "error" },
  adjustment: { label: "Ajuste", variant: "info" },
  purchase: { label: "Compra", variant: "warning" },
  refund: { label: "Reembolso", variant: "success" },
}

export function CreditAccountDetailDrawer({ customerId, onClose, onRefresh }: CreditAccountDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [account, setAccount] = useState<CreditAccountWithUser | null>(null)
  const [transactions, setTransactions] = useState<CreditTransactionWithUser[]>([])
  const [txPagination, setTxPagination] = useState<PaginationMeta>({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCreditAccountById(customerId)
      setAccount(data)
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }, [customerId])

  const fetchTransactions = useCallback(async (page = 1) => {
    try {
      setTxLoading(true)
      const result = await getCreditTransactionsByUser(customerId, page, 10)
      setTransactions(result.data)
      setTxPagination(result.pagination)
    } catch {
      // Non-critical
    } finally {
      setTxLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchAccount()
    fetchTransactions()
  }, [fetchAccount, fetchTransactions])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            {loading ? (
              <Skeleton className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {account?.user_name?.[0] || "U"}
              </div>
            )}
            <div>
              {loading ? (
                <Skeleton className="h-5 w-32 mb-1" />
              ) : (
                <h2 className="text-lg font-bold text-on-surface">{account?.user_name || "Sin nombre"}</h2>
              )}
              {loading ? (
                <Skeleton className="h-3 w-40" />
              ) : (
                <p className="text-xs text-on-surface-variant">{account?.user_email || "—"}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center hover:bg-surface-container-low transition-colors"
            aria-label="Cerrar"
          >
            <Icon name="close" className="text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
          {/* Balance Info */}
          <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="cash" className="text-green-400" />
              <h3 className="text-sm font-semibold text-on-surface">Información de Balance</h3>
            </div>
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase">Balance Actual</p>
                  <p className="text-lg font-bold text-green-400 mt-1">${Number(account?.balance ?? 0).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase">Total Otorgado</p>
                  <p className="text-lg font-bold text-blue-400 mt-1">${Number(account?.lifetime_credited ?? 0).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase">Total Gastado</p>
                  <p className="text-lg font-bold text-amber-500 mt-1">${Number(account?.lifetime_spent ?? 0).toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="information" className="text-on-surface-variant" />
              <h3 className="text-sm font-semibold text-on-surface">Detalles</h3>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Estado</span>
                  <StatusBadge
                    status={(account?.balance ?? 0) > 0 ? "Con Saldo" : "Sin Saldo"}
                    variant={(account?.balance ?? 0) > 0 ? "success" : "neutral"}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">ID de Cuenta</span>
                  <span className="text-primary font-mono text-[10px]">{account?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Creada</span>
                  <span className="text-on-surface">{account?.created_at ? formatDateFull(account.created_at) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Última Actualización</span>
                  <span className="text-on-surface">{account?.updated_at ? getRelativeDate(account.updated_at) : "—"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="swap-horizontal" className="text-on-surface-variant" />
                <h3 className="text-sm font-semibold text-on-surface">Transacciones Recientes</h3>
              </div>
              <span className="text-[10px] text-on-surface-variant">{txPagination.total} total</span>
            </div>
            {txLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-6">
                <Icon name="swap-horizontal" className="text-2xl text-on-surface-variant/30 mb-2 block mx-auto" />
                <p className="text-xs text-on-surface-variant">No hay transacciones registradas</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => {
                  const typeInfo = transactionTypeMap[tx.type] || { label: tx.type, variant: "neutral" as const }
                  const isCredit = tx.type === "admin_grant" || tx.type === "refund"
                  return (
                    <div key={tx.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCredit ? "bg-green-500/20" : "bg-red-500/20"}`}>
                        <Icon name={isCredit ? "arrow-down" : "arrow-up"} className={`text-xs ${isCredit ? "text-green-400" : "text-red-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={typeInfo.label} variant={typeInfo.variant} />
                          {tx.order_number && (
                            <span className="text-[10px] text-on-surface-variant">#{tx.order_number}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                          {tx.reason || "Sin razón"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-bold ${isCredit ? "text-green-400" : "text-red-400"}`}>
                          {isCredit ? "+" : "-"}${Number(tx.amount ?? 0).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">{getRelativeDate(tx.created_at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {txPagination.totalPages > 1 && (
              <div className="flex justify-center gap-1">
                {Array.from({ length: Math.min(txPagination.totalPages, 5) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchTransactions(i + 1)}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                      txPagination.page === i + 1
                        ? "bg-primary text-white"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with quick actions */}
        <div className="p-4 border-t border-white/5 flex gap-2">
          <button
            onClick={() => {
              onClose()
              // Trigger grant modal from parent via a custom event
              window.dispatchEvent(new CustomEvent("credit:grant", { detail: { customerId, userName: account?.user_name } }))
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/15 text-green-400 text-xs font-semibold rounded-xl hover:bg-green-500/25 transition-colors border border-green-500/20"
          >
            <Icon name="plus" className="text-sm" />
            Otorgar
          </button>
          <button
            onClick={() => {
              onClose()
              window.dispatchEvent(new CustomEvent("credit:deduct", { detail: { customerId, userName: account?.user_name } }))
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/15 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-500/25 transition-colors border border-red-500/20"
          >
            <Icon name="minus" className="text-sm" />
            Deducir
          </button>
          <button
            onClick={() => {
              onClose()
              window.dispatchEvent(new CustomEvent("credit:adjust", { detail: { customerId, userName: account?.user_name } }))
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5"
          >
            <Icon name="tune" className="text-sm" />
            Ajustar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
