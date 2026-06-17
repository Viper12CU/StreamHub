"use client"

import { memo } from "react"
import { sileo } from "sileo"
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
  { icon: "plus-circle", iconColor: "text-primary", iconBg: "bg-primary/20", text: "Plataforma 'ChatGPT Plus' creada", timestamp: "Hace 10 min", admin: "Admin Principal" },
  { icon: "pencil", iconColor: "text-secondary", iconBg: "bg-secondary/20", text: "Plataforma 'Netflix' actualizada — nuevo plan agregado", timestamp: "Hace 30 min", admin: "Admin Principal" },
  { icon: "package-variant", iconColor: "text-tertiary", iconBg: "bg-tertiary/20", text: "Inventario importado para 'Spotify' — 54 assets", timestamp: "Hace 1h", admin: "Sistema" },
  { icon: "pause-circle", iconColor: "text-amber-500", iconBg: "bg-amber-500/20", text: "Plataforma 'Paramount+' deshabilitada", timestamp: "Hace 2h", admin: "Admin Principal" },
  { icon: "archive", iconColor: "text-on-surface-variant", iconBg: "bg-surface-container-high", text: "Plataforma 'Apple TV+' archivada", timestamp: "Hace 3h", admin: "Admin Principal" },
  { icon: "cart-plus", iconColor: "text-green-400", iconBg: "bg-green-400/20", text: "Producto agregado a 'Disney+' — Disney+ Bundle", timestamp: "Hace 4h", admin: "Sistema" },
]

function RecentPlatformActivityInner() {
  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Icon name="history" className="text-sm text-primary" />
          Actividad Reciente de Plataformas
        </h3>
        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-bold rounded-full border border-amber-500/20">
          PRÓXIMAMENTE
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 items-start relative opacity-60">
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
      <p className="text-[10px] text-on-surface-variant/50 mt-4 text-center italic">
        Datos de ejemplo — requiere tabla de auditoría (audit_logs)
      </p>
    </div>
  )
}

export const RecentPlatformActivity = memo(RecentPlatformActivityInner)
