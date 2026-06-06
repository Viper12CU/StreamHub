"use client"

const deliveryQueue = [
  { id: "ORD-2026-000482", customer: "Alex Murphy", product: "Netflix Premium 4 Screens", asset: "Cuenta Netflix (ne****@gmail.com)" },
  { id: "ORD-2026-000477", customer: "Elena Kas", product: "Crunchyroll Mega", asset: "Cuenta Crunchyroll (cr****@hotmail.com)" },
  { id: "ORD-2026-000475", customer: "María García", product: "IPTV Premium", asset: "Código IPTV (IPTV-YYYY-YYYY-YYYY)" },
]

export function DeliveryQueue() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-400 text-sm">local_shipping</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-on-surface">Órdenes Listas para Entrega</h3>
            <p className="text-[10px] text-on-surface-variant">{deliveryQueue.length} pendientes</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {deliveryQueue.map((order) => (
          <div key={order.id} className="p-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">{order.id}</span>
                </div>
                <p className="text-xs text-on-surface font-medium">{order.customer}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{order.product}</p>
                <div className="mt-2 p-2 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Activo Asignado</p>
                  <p className="text-xs text-on-surface font-medium mt-0.5">{order.asset}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20">
                <span className="material-symbols-outlined text-sm">send</span>
                Entregar Ahora
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors border border-white/5">
                <span className="material-symbols-outlined text-sm">visibility</span>
                Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
