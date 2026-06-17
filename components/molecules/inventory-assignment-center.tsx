"use client"

import { useState } from "react"
import { Icon } from "@/components/atoms/icon"

interface InventoryAssignmentCenterProps {
  onClose: () => void
}

const pendingOrders = [
  { id: "ORD-9021", customer: "Alex Murphy", product: "Netflix Premium 4K", platform: "Netflix" },
  { id: "ORD-9018", customer: "Jordan Smith", product: "Spotify Family", platform: "Spotify" },
  { id: "ORD-9015", customer: "Elena Kas", product: "Disney+ Premium", platform: "Disney+" },
]

const compatibleAssets = [
  { id: "INV-000452", platform: "Netflix", identifier: "ne****@gmail.com", expiration: "2025-03-15" },
  { id: "INV-000446", platform: "Netflix", identifier: "Perfil: Carlos M.", expiration: "2025-06-01" },
  { id: "INV-000448", platform: "HBO Max", identifier: "hb****@yahoo.com", expiration: "2025-05-20" },
]

export function InventoryAssignmentCenter({ onClose }: InventoryAssignmentCenterProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const platformColors: Record<string, string> = {
    Netflix: "bg-primary-container",
    Spotify: "bg-secondary",
    "Disney+": "bg-tertiary",
  }

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden sticky top-24">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Icon name="clipboard-text" className="text-sm text-primary" />
          Centro de Asignación
        </h3>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
          <Icon name="close" className="text-sm" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {/* Pending Orders */}
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Órdenes Pendientes</p>
          <div className="space-y-2">
            {pendingOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedOrder === order.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface">{order.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${platformColors[order.platform] || "bg-surface-container-highest"}`} />
                    <span className="text-[10px] text-on-surface-variant">{order.platform}</span>
                  </div>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">{order.customer} • {order.product}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Compatible Assets */}
        {selectedOrder && (
          <div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Activos Compatibles</p>
            <div className="space-y-2">
              {compatibleAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedAsset === asset.id
                      ? "bg-primary/10 border-primary/30"
                      : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-primary">{asset.id}</span>
                    <span className="text-[10px] text-on-surface-variant">{asset.expiration}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 font-mono">{asset.identifier}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedOrder && selectedAsset && (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Asignar Activo
            </button>
            <button className="w-full py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5">
              Asignación Automática
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full max-w-sm bg-surface-container-lowest border border-white/10 rounded-2xl p-5 shadow-2xl">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Confirmar Asignación</h4>
            <p className="text-xs text-on-surface-variant mb-4">
              Asignar {selectedAsset} a la orden {selectedOrder}?
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors">
                Cancelar
              </button>
              <button onClick={() => { setShowConfirm(false); onClose() }} className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
