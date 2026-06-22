"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/components/atoms/icon"
import { getPlatforms, type PlatformWithMetrics } from "@/lib/api/platforms"

const platformColorMap: Record<string, string> = {
  netflix: "bg-primary-container",
  spotify: "bg-secondary",
  "disney-plus": "bg-tertiary",
  youtube: "bg-[#ff0000]",
  hbo: "bg-[#b829e3]",
  crunchyroll: "bg-[#f47521]",
}

export function PlatformMix() {
  const [platforms, setPlatforms] = useState<PlatformWithMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlatforms()
      .then((res) => setPlatforms(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalOrders = platforms.reduce((sum, p) => sum + p.total_orders, 0)

  const platformData = platforms
    .filter((p) => p.total_orders > 0)
    .sort((a, b) => b.total_orders - a.total_orders)
    .map((p) => ({
      name: p.name,
      percentage: totalOrders > 0 ? Math.round((p.total_orders / totalOrders) * 100) : 0,
      revenue: `$${p.revenue_monthly.toLocaleString()}`,
      color: platformColorMap[p.slug] || "bg-surface-container-highest",
    }))

  return (
    <div className="glass p-6 rounded-xl flex flex-col items-center md:col-span-3 lg:col-span-4">
      <h3 className="text-2xl font-semibold text-on-surface self-start mb-4">Distribución por Plataforma</h3>
      {loading ? (
        <div className="flex-1 flex items-center justify-center w-full">
          <Icon name="loading" className="text-lg text-on-surface-variant animate-spin" />
        </div>
      ) : platformData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <Icon name="chart-donut" className="text-4xl text-on-surface-variant/30 mb-2" />
          <p className="text-xs text-on-surface-variant">Sin datos de plataformas</p>
        </div>
      ) : (
        <>
          <div className="w-32 h-32 rounded-full border-[12px] border-primary-container/20 border-l-primary-container border-t-secondary relative flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="text-lg font-bold">{totalOrders}</p>
              <p className="text-[10px] text-on-surface-variant">órdenes</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
            {platformData.map((platform) => (
              <div key={platform.name} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${platform.color}`} />
                <span className="text-[10px] text-on-surface-variant flex-1">{platform.name}</span>
                <span className="text-[10px] font-semibold text-on-surface">{platform.percentage}%</span>
                <span className="text-[10px] text-on-surface-variant opacity-60">{platform.revenue}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
