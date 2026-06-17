"use client"

import { Icon } from "@/components/atoms/icon"

const assignmentQueue = [
  { id: "ORD-2026-000481", customer: "Sarah Chen", product: "Spotify Family", platform: "Spotify", available: 3 },
  { id: "ORD-2026-000478", customer: "Marcus V.", product: "HBO Max Ultra", platform: "HBO Max", available: 1 },
  { id: "ORD-2026-000475", customer: "María García", product: "IPTV Premium", platform: "IPTV", available: 5 },
  { id: "ORD-2026-000472", customer: "Alex Turner", product: "Netflix Premium 4 Screens", platform: "Netflix", available: 2 },
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

export function InventoryAssignmentQueue() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon name="package-variant-closed" className="text-secondary text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-on-surface">Órdenes Esperando Inventario</h3>
            <p className="text-[10px] text-on-surface-variant">{assignmentQueue.length} pendientes</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4">Orden</th>
              <th className="py-3">Producto</th>
              <th className="py-3">Stock</th>
              <th className="py-3">Cliente</th>
              <th className="py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {assignmentQueue.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-4 text-xs font-semibold text-primary">{order.id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${platformColors[order.platform] || "bg-surface-container-highest"}`} />
                    <span className="text-xs text-on-surface">{order.product}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-xs font-semibold text-green-400">{order.available} disponibles</span>
                </td>
                <td className="py-3 text-xs text-on-surface-variant">{order.customer}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                      Auto Asignar
                    </button>
                    <button className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors border border-white/5">
                      Manual
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
