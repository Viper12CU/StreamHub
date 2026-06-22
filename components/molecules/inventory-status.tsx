"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Icon } from "@/components/atoms/icon"
import { getInventoryStats, getLowStock, type InventoryStats, type LowStockItem } from "@/lib/api/inventory"

const platformAccentMap: Record<string, string> = {
  netflix: "platform-accent-netflix",
  spotify: "platform-accent-spotify",
  disney: "platform-accent-disney",
  youtube: "platform-accent-youtube",
  hbo: "platform-accent-hbo",
}

export function InventoryStatus() {
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [lowStock, setLowStock] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getInventoryStats(), getLowStock()])
      .then(([s, ls]) => { setStats(s); setLowStock(ls) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const summaryItems = stats ? [
    { label: "Disponibles", count: stats.available, color: "text-green-400", accentClass: "" },
    { label: "Reservados", count: stats.reserved, color: "text-secondary", accentClass: "" },
    { label: "Asignados", count: stats.assigned, color: "text-on-surface", accentClass: "" },
    { label: "Expirados", count: stats.expired, color: "text-error", accentClass: "" },
  ] : []

  return (
    <div className="glass p-6 rounded-xl lg:col-span-4">
      <h3 className="text-2xl font-semibold text-on-surface mb-4">Inventario</h3>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {summaryItems.map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-3 glass rounded-lg ${item.accentClass}`}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.label === "Expirados" && item.count > 0 && (
                    <Icon name="alert" className="text-sm text-error" />
                  )}
                </div>
                <span className={`text-[10px] font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
          {lowStock.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-error-container/10 border border-error/20">
              <p className="text-xs font-semibold text-error mb-2 flex items-center gap-1">
                <Icon name="alert" className="text-sm" />
                Stock Bajo
              </p>
              {lowStock.map((item) => (
                <div key={item.product} className="flex justify-between text-[10px] text-on-surface-variant py-1">
                  <span>{item.product}</span>
                  <span className="text-error font-semibold">{item.remaining} restantes</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <Link
        href="/admin/inventory"
        className="block w-full mt-4 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors text-center"
      >
        Gestionar Inventario
      </Link>
    </div>
  )
}
