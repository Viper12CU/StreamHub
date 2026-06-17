"use client"

import { useState, useEffect } from "react"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { getCustomerActivity, type CustomerActivityItem } from "@/lib/api/customers"

const actionConfig: Record<string, { icon: string; iconColor: string; iconBg: string }> = {
  "Cliente registrado": { icon: "account-plus", iconColor: "text-primary", iconBg: "bg-primary/20" },
  "Orden creada": { icon: "cart", iconColor: "text-secondary", iconBg: "bg-secondary/20" },
  "Pago completado": { icon: "check-circle", iconColor: "text-green-400", iconBg: "bg-green-400/20" },
  "Activo asignado": { icon: "account-reactivate", iconColor: "text-tertiary", iconBg: "bg-tertiary/20" },
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Ahora"
  if (minutes < 60) return `Hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

function ActivitySkeleton() {
  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <Skeleton className="h-4 w-48 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-start">
            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function RecentCustomerActivity() {
  const [activities, setActivities] = useState<CustomerActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getCustomerActivity(10)
      .then((data) => { if (!cancelled) setActivities(data) })
      .catch(() => { /* non-critical */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return <ActivitySkeleton />
  if (activities.length === 0) return null

  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Icon name="history" className="text-sm text-primary" />
          Actividad Reciente de Clientes
        </h3>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {activities.map((event, i) => {
            const config = actionConfig[event.action] || { icon: "info", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-high" }
            return (
              <div key={`${event.id}-${i}`} className="flex gap-4 items-start relative">
                <div className={`w-9 h-9 rounded-full ${config.iconBg} flex items-center justify-center z-10`}>
                  <Icon name={config.icon} className={`text-sm ${config.iconColor}`} />
                </div>
                <div className="flex-1 flex items-start justify-between">
                  <div>
                    <p className="text-xs text-on-surface">{event.action}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{event.detail}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant opacity-60 whitespace-nowrap ml-4">{getRelativeTime(event.timestamp)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
