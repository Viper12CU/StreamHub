import { Skeleton } from "@/components/ui/skeleton"
import type { InventoryActivity } from "@/lib/api/inventory"

interface RecentInventoryActivityProps {
  activities: InventoryActivity[]
  loading: boolean
}

const actionIcons: Record<string, { icon: string; color: string; bg: string }> = {
  "Activo creado": { icon: "add_circle", color: "text-green-400", bg: "bg-green-400/20" },
  "Activo asignado": { icon: "person_add", color: "text-secondary", bg: "bg-secondary/20" },
  "Activo reasignado": { icon: "swap_horiz", color: "text-tertiary", bg: "bg-tertiary/20" },
  "Activo renovado": { icon: "sync", color: "text-primary", bg: "bg-primary/20" },
  "Activo expirado": { icon: "timer_off", color: "text-error", bg: "bg-error/20" },
  "Activo suspendido": { icon: "block", color: "text-amber-500", bg: "bg-amber-500/20" },
}

function getDefaultIcon(action: string) {
  if (action.toLowerCase().includes("cread")) return actionIcons["Activo creado"]
  if (action.toLowerCase().includes("asign")) return actionIcons["Activo asignado"]
  if (action.toLowerCase().includes("reasign")) return actionIcons["Activo reasignado"]
  if (action.toLowerCase().includes("renov")) return actionIcons["Activo renovado"]
  if (action.toLowerCase().includes("expir")) return actionIcons["Activo expirado"]
  if (action.toLowerCase().includes("suspend")) return actionIcons["Activo suspendido"]
  return { icon: "info", color: "text-on-surface-variant", bg: "bg-surface-container-high" }
}

function formatTimestamp(ts: string) {
  try {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Ahora"
    if (mins < 60) return `Hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Hace ${hours}h`
    const days = Math.floor(hours / 24)
    return `Hace ${days}d`
  } catch {
    return ts
  }
}

export function RecentInventoryActivity({ activities, loading }: RecentInventoryActivityProps) {
  return (
    <div className="glass rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">history</span>
          Actividad Reciente del Inventario
        </h3>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-start"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="h-10 flex-1 rounded-lg" /></div>
        ))}</div>
      ) : activities.length === 0 ? (
        <p className="text-xs text-on-surface-variant opacity-60 text-center py-8">No hay actividad reciente</p>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-4">
            {activities.map((activity) => {
              const iconStyle = getDefaultIcon(activity.action)
              return (
                <div key={activity.id} className="flex gap-3 items-start relative">
                  <div className={`w-8 h-8 rounded-full ${iconStyle.bg} flex items-center justify-center z-10`}>
                    <span className={`material-symbols-outlined text-sm ${iconStyle.color}`}>{iconStyle.icon}</span>
                  </div>
                  <div className="flex-1 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{activity.action}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{activity.detail}</p>
                      <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">{activity.admin}</p>
                    </div>
                    <span className="text-[10px] text-on-surface-variant opacity-60 whitespace-nowrap ml-2">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
