"use client"

import type React from "react"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import type { CustomerAnalyticsData } from "@/lib/api/customers"

interface CustomerAnalyticsProps {
  analytics: CustomerAnalyticsData | null
  loading: boolean
}

export function CustomerAnalytics({ analytics, loading }: CustomerAnalyticsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass p-5 rounded-xl border border-white/5">
            <Skeleton className="h-4 w-40 mb-4" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  const growthData = analytics.growth ?? []
  const retention = analytics.retention ?? { repeat_buyers: 0, one_time_buyers: 0, retention_rate: 0 }
  const maxGrowth = growthData.length > 0 ? Math.max(...growthData.map((d) => d.count), 1) : 1

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Customer Growth */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="trending-up" className="text-sm text-primary" />
          Crecimiento de Clientes
        </h3>
        {growthData.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-xs text-on-surface-variant opacity-60">
            Sin datos de crecimiento
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {growthData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold text-on-surface">{item.count}</span>
                <div
                  className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary"
                  style={{ height: `${(item.count / maxGrowth) * 100}%` }}
                />
                <span className="text-[9px] text-on-surface-variant">{item.month.split("-")[1]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Retention Overview */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="chart-bar" className="text-sm text-primary" />
          Retención
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="repeat" className="text-sm text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Tasa de Retención</p>
              <p className="text-lg font-bold text-on-surface mt-0.5">{retention.retention_rate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="repeat" className="text-sm text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Compradores Recurrentes</p>
              <p className="text-lg font-bold text-on-surface mt-0.5">{retention.repeat_buyers}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon name="cart" className="text-sm text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Compradores Únicos</p>
              <p className="text-lg font-bold text-on-surface mt-0.5">{retention.one_time_buyers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
