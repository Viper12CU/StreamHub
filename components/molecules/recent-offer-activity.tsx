"use client"

import { Icon } from "@/components/atoms/icon"

interface ActivityEvent {
  icon: string
  iconColor: string
  iconBg: string
  text: string
  timestamp: string
  admin?: string
}

const events: ActivityEvent[] = [
  { icon: "tag-plus", iconColor: "text-primary", iconBg: "bg-primary/20", text: "Oferta \"Summer Streaming Sale\" creada", timestamp: "Hace 5 min", admin: "Admin Principal" },
  { icon: "check-circle", iconColor: "text-green-400", iconBg: "bg-green-400/20", text: "Oferta \"Netflix 2x1\" activada correctamente", timestamp: "Hace 22 min", admin: "Admin Principal" },
  { icon: "pencil", iconColor: "text-secondary", iconBg: "bg-secondary/20", text: "Oferta \"Black Friday Bundle\" editada — descuento ajustado a 35%", timestamp: "Hace 1h", admin: "Admin Principal" },
  { icon: "lightning-bolt", iconColor: "text-amber-500", iconBg: "bg-amber-500/20", text: "Flash Sale \"Spotify Premium\" iniciada — duración 48h", timestamp: "Hace 2h", admin: "Sistema" },
  { icon: "ticket-confirmation", iconColor: "text-purple-400", iconBg: "bg-purple-400/20", text: "Cupón \"WELCOME10\" redimido por 12 clientes nuevos", timestamp: "Hace 3h", admin: "Sistema" },
  { icon: "clock-alert", iconColor: "text-error", iconBg: "bg-error/20", text: "Oferta \"Flash Halloween\" expirada — 0 usos restantes", timestamp: "Hace 5h", admin: "Sistema" },
  { icon: "content-copy", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-high", text: "Oferta \"Summer Sale\" duplicada como \"Winter Sale Draft\"", timestamp: "Hace 8h", admin: "Admin Principal" },
  { icon: "archive", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-high", text: "Oferta \"Old Promo\" archivada tras expiración", timestamp: "Ayer", admin: "Sistema" },
]

export function RecentOfferActivity() {
  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Icon name="history" className="text-sm text-primary" />
          Actividad Reciente de Ofertas
        </h3>
        <button className="text-primary text-[11px] font-semibold hover:underline">Ver toda</button>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 items-start relative">
              <div className={`w-9 h-9 rounded-full ${event.iconBg} flex items-center justify-center z-10`}>
                <Icon name={event.icon} className={`text-sm ${event.iconColor}`} />
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
