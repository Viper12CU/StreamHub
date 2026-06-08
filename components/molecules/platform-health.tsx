"use client"

import { memo, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { HealthAlert } from "@/lib/api/platforms"
import { sileo } from "sileo"

interface PlatformHealthProps {
  alerts: HealthAlert[]
  loading: boolean
}

function HealthSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-6" />
              </div>
              <Skeleton className="h-2.5 w-40" />
            </div>
            <Skeleton className="h-3 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

function mapAlertToHealthItem(alert: HealthAlert): {
  icon: string
  title: string
  count: number | string
  description: string
  severity: "error" | "warning" | "info"
  action: string
} {
  const alertText = alert.alert.toLowerCase()

  if (alertText.includes("inactiva")) {
    return {
      icon: "pause_circle",
      title: "Plataforma Inactiva",
      count: 1,
      description: `${alert.name} está deshabilitada`,
      severity: "warning",
      action: "Revisar",
    }
  }
  if (alertText.includes("sin productos")) {
    return {
      icon: "warning",
      title: "Sin Productos Activos",
      count: 1,
      description: `${alert.name} no tiene productos activos`,
      severity: "error",
      action: "Ver",
    }
  }
  if (alertText.includes("sin ventas")) {
    return {
      icon: "trending_down",
      title: "Sin Ventas este Mes",
      count: 1,
      description: `${alert.name} no tiene ventas en el mes actual`,
      severity: "info",
      action: "Detalles",
    }
  }

  return {
    icon: "info",
    title: alert.name,
    count: 1,
    description: alert.alert,
    severity: "info",
    action: "Ver",
  }
}

const severityClasses = {
  error: "bg-error/10 border border-error/20",
  warning: "bg-amber-500/10 border border-amber-500/20",
  info: "bg-primary/10 border border-primary/20",
}

const severityIconColors = {
  error: "text-error",
  warning: "text-amber-500",
  info: "text-primary",
}

function PlatformHealthInner({ alerts, loading }: PlatformHealthProps) {
  if (loading) return <HealthSkeleton />

  const healthItems = useMemo(() => alerts.map(mapAlertToHealthItem), [alerts])

  if (healthItems.length === 0) {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-400 text-sm">monitor_heart</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface">Salud de Plataformas</h3>
        </div>
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-green-400/30 mb-2 block">check_circle</span>
          <p className="text-sm text-on-surface-variant">Todo está funcionando correctamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-green-400 text-sm">monitor_heart</span>
        </div>
        <h3 className="text-sm font-semibold text-on-surface">Salud de Plataformas</h3>
      </div>
      <div className="p-4 space-y-3">
        {healthItems.map((item, i) => (
          <div key={i} className={cn("p-3 rounded-xl flex items-center gap-3", severityClasses[item.severity])}>
            <span className={cn("material-symbols-outlined text-sm", severityIconColors[item.severity])}>{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-on-surface">{item.title}</p>
                <span className="text-[10px] font-bold text-on-surface-variant">{item.count}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{item.description}</p>
            </div>
            {item.action && (
              <button
                className="text-[10px] font-semibold text-primary hover:underline whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => sileo.success({ title: "Próximamente", description: `Acción "${item.action}" en desarrollo` })}
                aria-label={`${item.action} — ${item.title}`}
              >
                {item.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export const PlatformHealth = memo(PlatformHealthInner)
