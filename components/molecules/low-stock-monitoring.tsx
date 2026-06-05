const lowStockProducts = [
  { product: "Disney+ Premium", platform: "Disney+", remaining: 3, threshold: 10, action: "Agregar" },
  { product: "HBO Max Ultra", platform: "HBO Max", remaining: 5, threshold: 10, action: "Agregar" },
  { product: "YouTube Premium", platform: "YouTube Premium", remaining: 0, threshold: 8, action: "Urgente" },
  { product: "Crunchyroll Mega", platform: "Crunchyroll", remaining: 7, threshold: 12, action: "Agregar" },
  { product: "IPTV Premium", platform: "IPTV", remaining: 12, threshold: 15, action: "Monitorear" },
]

const platformColors: Record<string, string> = {
  Netflix: "bg-primary-container",
  Spotify: "bg-secondary",
  "YouTube Premium": "bg-[#ff0000]",
  "HBO Max": "bg-[#b829e3]",
  "Disney+": "bg-tertiary",
  Crunchyroll: "bg-[#f47521]",
  IPTV: "bg-amber-500",
}

function getStockColor(remaining: number) {
  if (remaining === 0) return "text-error"
  if (remaining <= 5) return "text-error"
  return "text-amber-500"
}

function getActionStyle(action: string) {
  if (action === "Urgente") return "bg-error/10 text-error border-error/20"
  if (action === "Agregar") return "bg-amber-500/10 text-amber-500 border-amber-500/20"
  return "bg-surface-container-high text-on-surface-variant border-white/5"
}

export function LowStockMonitoring() {
  return (
    <div className="glass rounded-xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
          Productos con Stock Bajo
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-xs">add</span>
          Agregar Inventario
        </button>
      </div>

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
            {lowStockProducts.map((item) => (
              <tr key={item.product} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 text-xs font-semibold text-on-surface">{item.product}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${platformColors[item.platform] || "bg-surface-container-highest"}`} />
                    <span className="text-[10px] text-on-surface-variant">{item.platform}</span>
                  </div>
                </td>
                <td className={`py-3 text-xs font-semibold text-right ${getStockColor(item.remaining)}`}>
                  {item.remaining}
                </td>
                <td className="py-3 text-xs text-on-surface-variant text-right">{item.threshold}</td>
                <td className="py-3 text-right">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getActionStyle(item.action)}`}>
                    {item.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
