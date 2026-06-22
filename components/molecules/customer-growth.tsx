"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/components/atoms/icon"
import { getCustomerAnalytics, type CustomerAnalyticsData } from "@/lib/api/customers"

export function CustomerGrowth() {
  const [data, setData] = useState<CustomerAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCustomerAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const growth = data?.growth || []
  const maxCount = Math.max(...growth.map((g) => g.count), 1)

  const buildPath = (key: "count" | "total") => {
    if (growth.length === 0) return ""
    const maxVal = key === "count" ? maxCount : Math.max(...growth.map((g) => g.total), 1)
    return growth
      .map((g, i) => {
        const x = (i / (growth.length - 1)) * 100
        const y = 100 - ((g[key] || 0) / maxVal) * 80
        return `${i === 0 ? "M" : "L"}${x},${y}`
      })
      .join(" ")
  }

  return (
    <div className="glass p-6 rounded-xl flex flex-col lg:col-span-7">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-on-surface">Crecimiento de Clientes</h3>
        <span className="text-[10px] text-on-surface-variant opacity-60">Últimos meses</span>
      </div>
      <div className="flex-1 min-h-[150px] relative mt-4">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="loading" className="text-lg text-on-surface-variant animate-spin" />
          </div>
        ) : growth.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon name="chart-line" className="text-4xl text-on-surface-variant/30 mb-2" />
            <p className="text-xs text-on-surface-variant">Sin datos de crecimiento</p>
          </div>
        ) : (
          <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d={buildPath("count")} fill="none" stroke="#ffb4aa" strokeWidth="2" />
            <path d={buildPath("total")} fill="none" stroke="#aec6ff" strokeDasharray="4" strokeWidth="2" />
          </svg>
        )}
      </div>
      <div className="mt-auto flex gap-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-primary" />
          <span className="text-[10px] text-on-surface-variant uppercase">Nuevos registros</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-secondary" />
          <span className="text-[10px] text-on-surface-variant uppercase">Clientes recurrentes</span>
        </div>
      </div>
    </div>
  )
}
