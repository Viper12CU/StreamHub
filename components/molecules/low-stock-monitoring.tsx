import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import type { LowStockItem } from "@/lib/api/inventory"

interface LowStockMonitoringProps {
  items: LowStockItem[]
  loading: boolean
}

function getStockColor(remaining: number) {
  if (remaining === 0) return "text-error"
  if (remaining <= 5) return "text-error"
  return "text-amber-500"
}

function getAction(remaining: number, threshold: number) {
  if (remaining === 0) return { label: "Urgente", style: "bg-error/10 text-error border-error/20" }
  if (remaining <= threshold * 0.5) return { label: "Agregar", style: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
  return { label: "Monitorear", style: "bg-surface-container-high text-on-surface-variant border-white/5" }
}

export function LowStockMonitoring({ items, loading }: LowStockMonitoringProps) {
  return (
    <div className="glass rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
          <Icon name="alert" className="text-sm text-amber-500" />
          Productos con Stock Bajo
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="check-circle" className="text-3xl text-green-400/40 mb-2" />
          <p className="text-xs text-on-surface-variant">Todos los productos tienen stock suficiente</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="py-2">Producto</th>
                <th className="py-2">Plataforma</th>
                <th className="py-2 text-right">Restantes</th>
                <th className="py-2 text-right">Umbral</th>
                <th className="py-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => {
                const action = getAction(item.remaining, item.threshold)
                return (
                  <tr key={item.product} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-xs font-semibold text-on-surface">{item.product}</td>
                    <td className="py-3 text-[10px] text-on-surface-variant">{item.platform}</td>
                    <td className={`py-3 text-xs font-semibold text-right ${getStockColor(item.remaining)}`}>
                      {item.remaining}
                    </td>
                    <td className="py-3 text-xs text-on-surface-variant text-right">{item.threshold}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${action.style}`}>
                        {action.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
