"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { CustomerInsightItem } from "@/lib/api/customers"

interface CustomerInsightsProps {
  insights: CustomerInsightItem[]
  loading: boolean
}

const typeConfig: Record<string, { icon: string; color: string; iconBg: string }> = {
  high_value: { icon: "diamond", color: "text-amber-500", iconBg: "bg-amber-500/10" },
  inactive: { icon: "person_off", color: "text-error", iconBg: "bg-error/10" },
  expiring: { icon: "timer", color: "text-orange-400", iconBg: "bg-orange-400/10" },
  repeat_buyer: { icon: "repeat", color: "text-green-400", iconBg: "bg-green-400/10" },
}

export function CustomerInsights({ insights, loading }: CustomerInsightsProps) {
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-4 border border-white/5">
              <Skeleton className="h-10 w-10 rounded-lg mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="glass rounded-xl p-4 border border-white/5">
          <Skeleton className="h-4 w-48 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg mb-2" />
          ))}
        </div>
      </div>
    )
  }

  if (!insights || insights.length === 0) return null

  const grouped = insights.reduce<Record<string, CustomerInsightItem[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {})

  const summaryCards = Object.entries(grouped).map(([type, items]) => {
    const config = typeConfig[type] || { icon: "info", color: "text-on-surface-variant", iconBg: "bg-surface-container-high" }
    return { type, count: items.length, config }
  })

  const highValueItems = grouped["high_value"] ?? []

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map(({ type, count, config }) => (
          <div key={type} className="glass rounded-xl p-4 border border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.iconBg)}>
                <span className={cn("material-symbols-outlined text-sm", config.color)}>{config.icon}</span>
              </div>
              <span className={cn("text-lg font-bold", config.color)}>{count}</span>
            </div>
            <p className="text-xs font-semibold text-on-surface capitalize">{type.replace("_", " ")}</p>
          </div>
        ))}
      </div>

      {/* High Value Items */}
      {highValueItems.length > 0 && (
        <div className="glass rounded-xl overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500 text-sm">diamond</span>
            </div>
            <h3 className="text-sm font-semibold text-on-surface">Clientes de Mayor Valor</h3>
          </div>
          <div className="divide-y divide-white/5">
            {highValueItems.map((item, idx) => (
              <div key={`high_value-${item.id}-${idx}`} className="p-3 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-xs font-medium text-on-surface">{item.description}</p>
                  <p className="text-[10px] text-on-surface-variant">{item.title}</p>
                </div>
                <span className="text-xs font-bold text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Insights */}
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-on-surface">Todas las Alertas</h3>
        </div>
        <div className="divide-y divide-white/5">
          {insights.map((item, idx) => {
            const config = typeConfig[item.type] || { icon: "info", color: "text-on-surface-variant", iconBg: "bg-surface-container-high" }
            return (
              <div key={`${item.type}-${item.id}-${idx}`} className="p-3 px-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.iconBg)}>
                  <span className={cn("material-symbols-outlined text-sm", config.color)}>{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-on-surface">{item.title}</p>
                  <p className="text-[10px] text-on-surface-variant truncate">{item.description}</p>
                </div>
                <span className="text-[10px] font-semibold text-on-surface-variant shrink-0">{item.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
