"use client"

import { MetricCard } from "@/components/atoms/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { CreditStats } from "@/lib/api/credits"

interface CreditStatsCardsProps {
  stats: CreditStats | null
  loading: boolean
}

export function CreditStatsCards({ stats, loading }: CreditStatsCardsProps) {
  if (loading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass p-4 rounded-xl border-l-4 border-primary/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton variant="circle" className="h-4 w-4" />
            </div>
            <Skeleton className="h-7 w-16 rounded mt-1" />
            <Skeleton className="h-2.5 w-24 rounded mt-0.5" />
          </div>
        ))}
      </section>
    )
  }

  if (!stats) return null

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <MetricCard
        label="Balance Total"
        description="En circulación"
        value={`$${Number(stats.total_balance ?? 0).toFixed(2)}`}
        accent="border-green-500"
        icon="cash"
        iconColor="text-green-400"
      />
      <MetricCard
        label="Cuentas Activas"
        description="Con saldo > 0"
        value={stats.active_accounts.toLocaleString()}
        accent="border-primary"
        badge="Activo"
        badgeColor="text-primary"
        icon="check-circle"
        iconColor="text-primary"
      />
      <MetricCard
        label="Total Otorgados"
        description="Histórico"
        value={`$${Number(stats.total_credited ?? 0).toFixed(2)}`}
        accent="border-blue-500"
        icon="arrow-up-bold"
        iconColor="text-blue-400"
      />
      <MetricCard
        label="Total Gastado"
        description="Histórico"
        value={`$${Number(stats.total_spent ?? 0).toFixed(2)}`}
        accent="border-amber-500"
        icon="arrow-down-bold"
        iconColor="text-amber-500"
      />
      <MetricCard
        label="Total Cuentas"
        description="Registradas"
        value={stats.total_accounts.toLocaleString()}
        accent="border-purple-500"
        icon="account-multiple"
        iconColor="text-purple-400"
      />
    </section>
  )
}
