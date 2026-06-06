"use client"

interface ActivityEvent {
  icon: string
  iconColor: string
  iconBg: string
  customer: string
  text: string
  timestamp: string
}

const events: ActivityEvent[] = [
  { icon: "person_add", iconColor: "text-primary", iconBg: "bg-primary/20", customer: "Luna Rodriguez", text: "Nuevo cliente registrado", timestamp: "Hace 5 min" },
  { icon: "shopping_cart", iconColor: "text-secondary", iconBg: "bg-secondary/20", customer: "Alex Murphy", text: "Orden creada - Netflix Premium", timestamp: "Hace 12 min" },
  { icon: "check_circle", iconColor: "text-green-400", iconBg: "bg-green-400/20", customer: "Sarah Chen", text: "Pago completado - $14.99", timestamp: "Hace 20 min" },
  { icon: "subscriptions", iconColor: "text-tertiary", iconBg: "bg-tertiary/20", customer: "Marcus V.", text: "Suscripción renovada - HBO Max", timestamp: "Hace 35 min" },
  { icon: "support_agent", iconColor: "text-amber-500", iconBg: "bg-amber-500/20", customer: "Jordan Smith", text: "Ticket de soporte abierto", timestamp: "Hace 1h" },
  { icon: "diamond", iconColor: "text-amber-500", iconBg: "bg-amber-500/20", customer: "Elena Kas", text: "Marcada como cliente VIP", timestamp: "Hace 2h" },
]

export function RecentCustomerActivity() {
  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">history</span>
          Actividad Reciente de Clientes
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
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{event.customer}</p>
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
