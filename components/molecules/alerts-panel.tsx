interface Alert {
  icon: string
  text: string
  timestamp: string
  severity: "error" | "warning" | "info"
  action?: string
}

const alerts: Alert[] = [
  { icon: "schedule", text: "5 pagos pendientes > 24h", severity: "error", timestamp: "Hace 10 min", action: "Revisar" },
  { icon: "inventory_2", text: "Disney+ sin stock (12 pausados)", severity: "error", timestamp: "Hace 25 min", action: "Gestionar" },
  { icon: "local_shipping", text: "8 órdenes esperando entrega", severity: "warning", timestamp: "Hace 1h", action: "Ver" },
  { icon: "dns", text: "Latencia en Gateway EU", severity: "warning", timestamp: "Hace 2h", action: "Detalles" },
  { icon: "info", text: "Mantenimiento DB a las 02:00 AM", severity: "info", timestamp: "Hace 3h" },
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

export function AlertsPanel() {
  return (
    <div className="glass-active p-6 rounded-xl border-error/20 flex flex-col gap-4 md:col-span-3 lg:col-span-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-error">warning</span>
        <h3 className="text-2xl font-semibold text-on-surface">Alertas Críticas</h3>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex gap-3 p-3 rounded-lg ${variantClasses[alert.severity]}`}>
            <span className={`material-symbols-outlined text-sm ${iconColors[alert.severity]}`}>{alert.icon}</span>
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
        ))}
      </div>
    </div>
  )
}
