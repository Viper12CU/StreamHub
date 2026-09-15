"use client"

import { memo } from "react"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import type { CreditAnalyticsData } from "@/lib/api/credits"

interface CreditAnalyticsProps {
  analytics: CreditAnalyticsData | null
  loading: boolean
}

const typeColors: Record<string, string> = {
  admin_grant: "bg-green-500",
  admin_deduct: "bg-red-500",
  adjustment: "bg-blue-500",
  purchase: "bg-amber-500",
  refund: "bg-purple-500",
}

const typeLabels: Record<string, string> = {
  admin_grant: "Otorgados",
  admin_deduct: "Deducidos",
  adjustment: "Ajustes",
  purchase: "Compras",
  refund: "Reembolsos",
}

export const CreditAnalytics = memo(function CreditAnalytics({ analytics, loading }: CreditAnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const maxCount = Math.max(...analytics.transactions_by_type.map(t => t.count), 1)

  return (
    <div className="space-y-5">
      {/* Transactions by type */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="chart-bar" className="text-primary text-sm" />
          <h3 className="text-xs font-semibold text-on-surface">Transacciones por Tipo</h3>
        </div>
        <div className="space-y-3">
          {analytics.transactions_by_type.map((item, i) => {
            const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0
            return (
              <div key={`${item.type}-${i}`} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${typeColors[item.type] || "bg-gray-500"}`} />
                    <span className="text-[11px] text-on-surface-variant">{typeLabels[item.type] || item.type}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-surface">{item.count}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${typeColors[item.type] || "bg-gray-500"} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Balance Distribution */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="chart-donut" className="text-primary text-sm" />
          <h3 className="text-xs font-semibold text-on-surface">Distribución de Balances</h3>
        </div>
        <div className="space-y-2">
          {analytics.balance_distribution.map((item, i) => (
            <div key={`${item.range}-${i}`} className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
              <span className="text-[11px] text-on-surface-variant">{item.range}</span>
              <span className="text-[11px] font-semibold text-on-surface">{item.count} cuentas</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users */}
      <div className="glass rounded-xl p-5 border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="trophy" className="text-amber-500 text-sm" />
          <h3 className="text-xs font-semibold text-on-surface">Top 5 por Balance</h3>
        </div>
        <div className="space-y-2">
          {analytics.top_users.length === 0 ? (
            <p className="text-[11px] text-on-surface-variant text-center py-4">Sin datos disponibles</p>
          ) : (
            analytics.top_users.map((user, i) => (
              <div key={`${user.user_id}-${i}`} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? "bg-amber-500/20 text-amber-500" :
                  i === 1 ? "bg-gray-300/20 text-gray-300" :
                  i === 2 ? "bg-orange-500/20 text-orange-400" :
                  "bg-surface-container-high text-on-surface-variant"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-on-surface truncate">{user.user_name || "Sin nombre"}</p>
                </div>
                <span className="text-[11px] font-bold text-green-400">${Number(user.balance ?? 0).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
})
