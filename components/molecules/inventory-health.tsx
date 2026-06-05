"use client"

import { cn } from "@/lib/utils"

const distribution = [
  { label: "Disponible", count: 842, percentage: 67.6, color: "bg-green-400" },
  { label: "Reservado", count: 76, percentage: 6.1, color: "bg-amber-500" },
  { label: "Asignado", count: 289, percentage: 23.2, color: "bg-secondary" },
  { label: "Expirado", count: 38, percentage: 3.1, color: "bg-error" },
]

const byPlatform = [
  { name: "Netflix", count: 420, color: "bg-primary-container" },
  { name: "Spotify", count: 312, color: "bg-secondary" },
  { name: "Disney+", count: 198, color: "bg-tertiary" },
  { name: "YouTube", count: 156, color: "bg-[#ff0000]" },
  { name: "HBO Max", count: 102, color: "bg-[#b829e3]" },
  { name: "Otros", count: 57, color: "bg-surface-container-highest" },
]

const expiring = [
  { id: "INV-000443", product: "Disney+ + ESPN", days: 10, status: "assigned" },
  { id: "INV-000447", product: "Crunchyroll Mega", days: 15, status: "assigned" },
  { id: "INV-000445", product: "Spotify Individual", days: 32, status: "suspended" },
  { id: "INV-000451", product: "Spotify Family", days: 45, status: "assigned" },
]

export function InventoryHealth() {
  return (
    <section className="glass rounded-xl border border-white/5 p-5">
      <h3 className="text-base font-semibold text-on-surface mb-5 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-primary">monitor_heart</span>
        Salud del Inventario
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Distribution Donut */}
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4 self-start">Distribución</p>
          <div className="w-32 h-32 rounded-full border-[10px] border-green-400/20 border-t-green-400 border-r-amber-500 border-b-secondary relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-primary-container border-r-[#ff0000] border-b-[#b829e3] opacity-50" />
            <div className="text-center">
              <p className="text-lg font-bold text-on-surface">1,245</p>
              <p className="text-[8px] text-on-surface-variant">total</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 w-full">
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="text-[10px] text-on-surface-variant flex-1">{item.label}</span>
                <span className="text-[10px] font-semibold text-on-surface">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Platform Bar */}
        <div>
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Por Plataforma</p>
          <div className="space-y-3">
            {byPlatform.map((platform) => (
              <div key={platform.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-on-surface">{platform.name}</span>
                  <span className="text-[10px] font-semibold text-on-surface-variant">{platform.count}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", platform.color)} style={{ width: `${(platform.count / 420) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Assets */}
        <div>
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Próximos a Expirar</p>
          <div className="space-y-2">
            {expiring.map((asset) => (
              <div key={asset.id} className={cn(
                "p-3 rounded-lg border flex items-center justify-between",
                asset.days <= 10 ? "bg-error/10 border-error/20" :
                asset.days <= 15 ? "bg-amber-500/10 border-amber-500/20" :
                "bg-surface-container-low border-white/5"
              )}>
                <div>
                  <p className="text-xs font-semibold text-on-surface">{asset.product}</p>
                  <p className="text-[10px] text-on-surface-variant">{asset.id}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-bold",
                  asset.days <= 10 ? "text-error" :
                  asset.days <= 15 ? "text-amber-500" :
                  "text-on-surface-variant"
                )}>
                  {asset.days} días
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
