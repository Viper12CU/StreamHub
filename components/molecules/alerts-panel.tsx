"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/components/atoms/icon"
import { getHealthAlerts, type HealthAlert } from "@/lib/api/platforms"
import { getLowStock, getPendingOrders, type LowStockItem, type PendingOrder } from "@/lib/api/inventory"

interface Alert {
  icon: string
  text: string
  timestamp: string
  severity: "error" | "warning" | "info"
  action?: string
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const [healthAlerts, lowStock, pendingOrders] = await Promise.all([
          getHealthAlerts().catch(() => []),
          getLowStock().catch(() => []),
          getPendingOrders().catch(() => []),
        ])

        const result: Alert[] = []

        for (const item of lowStock) {
          result.push({
            icon: "package-variant",
            text: `${item.product} — ${item.remaining} restantes (umbral: ${item.threshold})`,
            severity: "error",
            timestamp: item.platform,
            action: "Gestionar",
          })
        }

        for (const order of pendingOrders) {
          result.push({
            icon: "cart",
            text: `Orden ${order.order_number} — ${order.customer} espera ${order.product}`,
            severity: "warning",
            timestamp: order.platform,
            action: "Ver",
          })
        }

        for (const ha of healthAlerts) {
          result.push({
            icon: "alert",
            text: `${ha.name}: ${ha.alert}`,
            severity: ha.status === "active" ? "warning" : "error",
            timestamp: `${ha.products_count} productos`,
          })
        }

        setAlerts(result)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  const variantClasses = {
    error: "bg-error-container/10 border border-error/20",
    warning: "bg-primary-container/10 border border-primary-container/20",
    info: "bg-surface-container-high border border-transparent",
  }

  const iconColors = {
    error: "text-error",
    warning: "text-primary-container",
    info: "text-secondary",
  }

  return (
    <div className="glass-active p-6 rounded-xl border-error/20 flex flex-col gap-4 md:col-span-3 lg:col-span-4">
      <div className="flex items-center gap-2">
        <Icon name="alert" className="text-error" />
        <h3 className="text-2xl font-semibold text-on-surface">Alertas Críticas</h3>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg skeleton-shimmer" />
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Icon name="check-circle" className="text-4xl text-green-400/50 mb-2" />
            <p className="text-xs text-on-surface-variant">Todo funciona correctamente</p>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className={`flex gap-3 p-3 rounded-lg ${variantClasses[alert.severity]}`}>
              <Icon name={alert.icon} className={`text-sm ${iconColors[alert.severity]}`} />
              <div className="flex-1">
                <p className="text-sm text-on-surface">{alert.text}</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">{alert.timestamp}</p>
              </div>
              {alert.action && (
                <button className="text-[10px] font-semibold text-primary hover:underline self-start whitespace-nowrap">
                  {alert.action}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
