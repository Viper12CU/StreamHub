"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import type { InventoryHealth as InventoryHealthType } from "@/lib/api/inventory"

interface InventoryHealthProps {
  health: InventoryHealthType | null
  loading: boolean
}

const distributionColors: Record<string, string> = {
  Disponible: "bg-green-400",
  Reservado: "bg-amber-500",
  Asignado: "bg-secondary",
  Expirado: "bg-error",
  Suspendido: "bg-tertiary",
}

function HealthSkeleton() {
  return (
    <section className="glass rounded-xl border border-white/5 p-5">
      <Skeleton className="h-5 w-48 mb-5" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="flex flex-col items-center gap-4"><Skeleton className="w-32 h-32 rounded-full" /></div>
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
      </div>
    </section>
  )
}

export function InventoryHealth({ health, loading }: InventoryHealthProps) {
  if (loading || !health) return <HealthSkeleton />

  const total = health.distribution.reduce((sum, d) => sum + d.count, 0)
  const maxPlatform = Math.max(...health.byPlatform.map((p) => p.count), 1)

  return (
    <section className="glass rounded-xl border border-white/5 p-5">
      <h3 className="text-base font-semibold text-on-surface mb-5 flex items-center gap-2">
        <Icon name="monitor-dashboard" className="text-sm text-primary" />
        Salud del Inventario
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Distribution Donut */}
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4 self-start">Distribución</p>
          <div className="w-32 h-32 rounded-full border-[10px] border-green-400/20 border-t-green-400 border-r-amber-500 border-b-secondary relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-primary-container border-r-[#ff0000] border-b-[#b829e3] opacity-50" />
            <div className="text-center">
              <p className="text-lg font-bold text-on-surface">{total.toLocaleString()}</p>
              <p className="text-[8px] text-on-surface-variant">total</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 w-full">
            {health.distribution.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", distributionColors[item.label] || "bg-surface-container-highest")} />
                <span className="text-[10px] text-on-surface-variant flex-1">{item.label}</span>
                <span className="text-[10px] font-semibold text-on-surface">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Platform Bar */}
        <div>
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Por Plataforma</p>
          <div className="space-y-3">
            {health.byPlatform.map((platform, i) => {
              const colors = ["bg-primary-container", "bg-secondary", "bg-tertiary", "bg-[#ff0000]", "bg-[#b829e3]", "bg-surface-container-highest"]
              return (
                <div key={platform.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-on-surface">{platform.name}</span>
                    <span className="text-[10px] font-semibold text-on-surface-variant">{platform.count}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", colors[i % colors.length])} style={{ width: `${(platform.count / maxPlatform) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Expiring Assets */}
        <div>
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Próximos a Expirar</p>
          <div className="space-y-2">
            {health.expiring.length === 0 && (
              <p className="text-xs text-on-surface-variant opacity-60 text-center py-4">No hay activos por expirar</p>
            )}
            {health.expiring.map((asset) => (
              <div key={asset.id} className={cn(
                "p-3 rounded-lg border flex items-center justify-between",
                asset.days <= 10 ? "bg-error/10 border-error/20" :
                asset.days <= 15 ? "bg-amber-500/10 border-amber-500/20" :
                "bg-surface-container-low border-white/5"
              )}>
                <div>
                  <p className="text-xs font-semibold text-on-surface">{asset.product}</p>
                  <p className="text-[10px] text-on-surface-variant">{asset.id.slice(0, 8)}</p>
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
