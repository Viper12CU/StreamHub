"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface Alert {
  icon: string
  text: string
  timestamp: string
  severity: "error" | "warning" | "info"
  action?: string
}

const alerts: Alert[] = [
  { icon: "clock-outline", text: "5 órdenes esperando más de 24 horas", severity: "error", timestamp: "Requiere atención", action: "Revisar" },
  { icon: "shield-check", text: "7 pagos esperando verificación", severity: "warning", timestamp: "Actualizado hace 10 min", action: "Verificar" },
  { icon: "package-variant", text: "3 órdenes sin inventario disponible", severity: "error", timestamp: "Actualizado hace 25 min", action: "Gestionar" },
  { icon: "truck", text: "2 intentos de entrega fallidos", severity: "warning", timestamp: "Actualizado hace 1h", action: "Ver" },
  { icon: "alert-circle", text: "1 disputa de pago activa", severity: "error", timestamp: "Actualizado hace 2h", action: "Detalles" },
  { icon: "information", text: "Mantenimiento programado 02:00 AM", severity: "info", timestamp: "Hace 3h" },
]

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

export function OperationalAlerts() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
            <Icon name="alert" className="text-error text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-on-surface">Alertas Operacionales</h3>
            <p className="text-[10px] text-on-surface-variant">{alerts.filter((a) => a.severity === "error").length} críticas</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {alerts.map((alert, i) => (
          <div key={i} className={cn("p-4 flex gap-3", variantClasses[alert.severity])}>
            <Icon name={alert.icon} className={cn("text-sm", iconColors[alert.severity])} />
            <div className="flex-1">
              <p className="text-xs text-on-surface">{alert.text}</p>
              <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">{alert.timestamp}</p>
            </div>
            {alert.action && (
              <button className="text-[10px] font-semibold text-primary hover:underline self-start whitespace-nowrap">
                {alert.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
