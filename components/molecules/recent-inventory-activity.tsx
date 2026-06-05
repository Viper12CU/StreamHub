const activities = [
  { icon: "add_circle", color: "text-green-400", bg: "bg-green-400/20", action: "Activo creado", detail: "INV-000452 • Netflix Premium", admin: "Admin Principal", timestamp: "Hace 2h" },
  { icon: "person_add", color: "text-secondary", bg: "bg-secondary/20", action: "Activo asignado", detail: "INV-000451 → Alex Murphy", admin: "Admin Principal", timestamp: "Hace 4h" },
  { icon: "swap_horiz", color: "text-tertiary", bg: "bg-tertiary/20", action: "Activo reasignado", detail: "INV-000449 → Jordan Smith", admin: "Soporte", timestamp: "Hace 6h" },
  { icon: "sync", color: "text-primary", bg: "bg-primary/20", action: "Activo renovado", detail: "INV-000448 • HBO Max Ultra", admin: "System", timestamp: "Hace 12h" },
  { icon: "timer_off", color: "text-error", bg: "bg-error/20", action: "Activo expirado", detail: "INV-000446 • YouTube Premium", admin: "System", timestamp: "Hace 1d" },
  { icon: "block", color: "text-amber-500", bg: "bg-amber-500/20", action: "Activo suspendido", detail: "INV-000445 • Spotify Individual", admin: "Admin Principal", timestamp: "Hace 3d" },
]

export function RecentInventoryActivity() {
  return (
    <div className="glass rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">history</span>
          Actividad Reciente del Inventario
        </h3>
        <button className="text-primary text-[11px] font-semibold hover:underline">Ver toda</button>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex gap-3 items-start relative">
              <div className={`w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center z-10`}>
                <span className={`material-symbols-outlined text-sm ${activity.color}`}>{activity.icon}</span>
              </div>
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-on-surface">{activity.action}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{activity.detail}</p>
                  <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">{activity.admin}</p>
                </div>
                <span className="text-[10px] text-on-surface-variant opacity-60 whitespace-nowrap ml-2">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
