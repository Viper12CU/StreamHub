"use client"

interface ActivityEvent {
  icon: string
  iconColor: string
  iconBg: string
  text: string
  timestamp: string
  admin?: string
}

const events: ActivityEvent[] = [
  { icon: "shopping_cart", iconColor: "text-primary", iconBg: "bg-primary/20", text: "Orden ORD-2026-000482 creada por Alex Murphy", timestamp: "Hace 2 min", admin: "Sistema" },
  { icon: "check_circle", iconColor: "text-green-400", iconBg: "bg-green-400/20", text: "Pago aprobado - ORD-2026-000481 (Sarah Chen)", timestamp: "Hace 8 min", admin: "Admin Principal" },
  { icon: "inventory_2", iconColor: "text-secondary", iconBg: "bg-secondary/20", text: "Cuenta Netflix asignada a ORD-2026-000478 (Marcus V.)", timestamp: "Hace 15 min", admin: "Admin Principal" },
  { icon: "local_shipping", iconColor: "text-tertiary", iconBg: "bg-tertiary/20", text: "Orden ORD-2026-000477 entregada a Elena Kas", timestamp: "Hace 22 min", admin: "Sistema" },
  { icon: "undo", iconColor: "text-amber-500", iconBg: "bg-amber-500/20", text: "Reembolso procesado - ORD-2026-000473 (Ana López)", timestamp: "Hace 35 min", admin: "Admin Principal" },
  { icon: "cancel", iconColor: "text-error", iconBg: "bg-error/20", text: "Orden ORD-2026-000476 cancelada por Carlos M.", timestamp: "Hace 1h", admin: "Sistema" },
]

export function RecentOrderActivity() {
  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">history</span>
          Actividad Reciente de Órdenes
        </h3>
        <button className="text-primary text-[11px] font-semibold hover:underline">Ver toda</button>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 items-start relative">
              <div className={`w-9 h-9 rounded-full ${event.iconBg} flex items-center justify-center z-10`}>
                <span className={`material-symbols-outlined text-sm ${event.iconColor}`}>{event.icon}</span>
              </div>
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <p className="text-xs text-on-surface">{event.text}</p>
                  {event.admin && (
                    <p className="text-[10px] text-on-surface-variant mt-0.5">por {event.admin}</p>
                  )}
                </div>
                <span className="text-[10px] text-on-surface-variant opacity-60 whitespace-nowrap ml-4">{event.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
