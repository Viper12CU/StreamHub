interface ActivityEvent {
  icon: string
  iconColor: string
  iconBg: string
  text: string
  timestamp: string
}

const events: ActivityEvent[] = [
  { icon: "shopping_cart", iconColor: "text-primary", iconBg: "bg-primary/20", text: "Nueva orden creada por Alex Murphy", timestamp: "Hace 2 min" },
  { icon: "check_circle", iconColor: "text-green-400", iconBg: "bg-green-400/20", text: "Pago aprobado de Sarah Chen", timestamp: "Hace 5 min" },
  { icon: "inventory_2", iconColor: "text-secondary", iconBg: "bg-secondary/20", text: "Cuenta Netflix asignada a Jordan Smith", timestamp: "Hace 12 min" },
  { icon: "person_add", iconColor: "text-tertiary", iconBg: "bg-tertiary/20", text: "Nuevo cliente registrado: Luna Rodriguez", timestamp: "Hace 18 min" },
  { icon: "edit", iconColor: "text-primary-container", iconBg: "bg-primary-container/20", text: "Producto actualizado: Netflix Premium 4K", timestamp: "Hace 25 min" },
  { icon: "local_shipping", iconColor: "text-secondary", iconBg: "bg-secondary/20", text: "Pedido #ORD-9001 entregado a Marcus V.", timestamp: "Hace 32 min" },
]

export function RecentActivityFeed() {
  return (
    <div className="glass p-6 rounded-xl lg:col-span-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-on-surface">Actividad Reciente</h3>
        <button className="text-primary text-xs font-semibold hover:underline">Ver toda la actividad</button>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 items-start relative">
              <div className={`w-10 h-10 rounded-full ${event.iconBg} flex items-center justify-center z-10`}>
                <span className={`material-symbols-outlined text-sm ${event.iconColor}`}>{event.icon}</span>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm text-on-surface">{event.text}</p>
                <span className="text-[10px] text-on-surface-variant opacity-60 whitespace-nowrap ml-4">{event.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
