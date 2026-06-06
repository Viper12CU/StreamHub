"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"

interface Asset {
  id: string
  platform: string
  type: string
  product: string
  identifier: string
  status: "available" | "reserved" | "assigned" | "expired" | "suspended"
  customer: string | null
  expirationDate: string
  daysRemaining: number | null
  lastUpdated: string
}

interface InventoryTableProps {
  selectedAssets: string[]
  onSelectAssets: (ids: string[]) => void
  onViewAsset: (id: string) => void
  activeTab: string
}

const assets: Asset[] = [
  { id: "INV-000452", platform: "Netflix", type: "Cuenta Completa", product: "Netflix Premium 4 Screens", identifier: "ne****@gmail.com", status: "available", customer: null, expirationDate: "2025-03-15", daysRemaining: 120, lastUpdated: "Hace 2h" },
  { id: "INV-000451", platform: "Spotify", type: "Perfil Compartido", product: "Spotify Family", identifier: "Perfil: María G.", status: "assigned", customer: "Alex Murphy", expirationDate: "2025-02-28", daysRemaining: 45, lastUpdated: "Hace 4h" },
  { id: "INV-000450", platform: "Disney+", type: "Cuenta Completa", product: "Disney+ Premium", identifier: "dis****@outlook.com", status: "reserved", customer: "Jordan Smith", expirationDate: "2025-04-10", daysRemaining: 146, lastUpdated: "Hace 6h" },
  { id: "INV-000449", platform: "YouTube Premium", type: "Código de Activación", product: "YouTube Premium", identifier: "YT-XXXX-XXXX-XXXX", status: "expired", customer: null, expirationDate: "2024-12-01", daysRemaining: null, lastUpdated: "Hace 1d" },
  { id: "INV-000448", platform: "HBO Max", type: "Cuenta Completa", product: "HBO Max Ultra", identifier: "hb****@yahoo.com", status: "available", customer: null, expirationDate: "2025-05-20", daysRemaining: 186, lastUpdated: "Hace 12h" },
  { id: "INV-000447", platform: "Crunchyroll", type: "Cuenta Completa", product: "Crunchyroll Mega", identifier: "cr****@hotmail.com", status: "assigned", customer: "Elena Kas", expirationDate: "2025-01-30", daysRemaining: 15, lastUpdated: "Hace 2d" },
  { id: "INV-000446", platform: "Netflix", type: "Perfil Compartido", product: "Netflix Standard", identifier: "Perfil: Carlos M.", status: "available", customer: null, expirationDate: "2025-06-01", daysRemaining: 198, lastUpdated: "Hace 3d" },
  { id: "INV-000445", platform: "Spotify", type: "Cuenta Completa", product: "Spotify Individual", identifier: "sp****@gmail.com", status: "suspended", customer: "Marcus V.", expirationDate: "2025-02-15", daysRemaining: 32, lastUpdated: "Hace 3d" },
  { id: "INV-000444", platform: "IPTV", type: "Código de Activación", product: "IPTV Premium", identifier: "IPTV-YYYY-YYYY-YYYY", status: "available", customer: null, expirationDate: "2025-07-10", daysRemaining: 237, lastUpdated: "Hace 4d" },
  { id: "INV-000443", platform: "Disney+", type: "Cuenta Completa", product: "Disney+ + ESPN", identifier: "dis****@live.com", status: "assigned", customer: "Sarah Chen", expirationDate: "2025-01-25", daysRemaining: 10, lastUpdated: "Hace 5d" },
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

const statusMap = {
  available: { label: "Disponible", variant: "success" as const },
  reserved: { label: "Reservado", variant: "warning" as const },
  assigned: { label: "Asignado", variant: "neutral" as const },
  expired: { label: "Expirado", variant: "error" as const },
  suspended: { label: "Suspendido", variant: "error" as const },
}

function getExpirationStyle(days: number | null) {
  if (days === null) return "text-error"
  if (days <= 7) return "text-error font-bold"
  if (days <= 15) return "text-amber-500 font-semibold"
  return "text-on-surface-variant"
}

export function InventoryTable({ selectedAssets, onSelectAssets, onViewAsset, activeTab }: InventoryTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const filteredAssets = activeTab === "all"
    ? assets
    : assets.filter((a) => {
        if (activeTab === "accounts") return a.type === "Cuenta Completa"
        if (activeTab === "profiles") return a.type === "Perfil Compartido"
        if (activeTab === "codes") return a.type === "Código de Activación"
        if (activeTab === "packages") return a.type === "Paquete"
        return true
      })

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectAssets([])
    } else {
      onSelectAssets(filteredAssets.map((a) => a.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectAsset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = selectedAssets.includes(id)
      ? selectedAssets.filter((aid) => aid !== id)
      : [...selectedAssets, id]
    onSelectAssets(updated)
    setSelectAll(updated.length === filteredAssets.length)
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-base font-semibold text-on-surface">Activos Digitales</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded accent-primary"
                />
              </th>
              <th className="py-3">ID</th>
              <th className="py-3">Plataforma</th>
              <th className="py-3">Tipo</th>
              <th className="py-3">Producto</th>
              <th className="py-3">Identificador</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Cliente</th>
              <th className="py-3">Expiración</th>
              <th className="py-3">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAssets.map((asset) => (
              <tr
                key={asset.id}
                onClick={() => onViewAsset(asset.id)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={(e) => handleSelectAsset(e, asset.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-primary"
                  />
                </td>
                <td className="py-3 text-xs font-semibold text-primary">{asset.id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", platformColors[asset.platform] || "bg-surface-container-highest")} />
                    <span className="text-xs text-on-surface-variant">{asset.platform}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-on-surface-variant">{asset.type}</td>
                <td className="py-3 text-xs text-on-surface max-w-[150px] truncate">{asset.product}</td>
                <td className="py-3 text-xs text-on-surface-variant font-mono">{asset.identifier}</td>
                <td className="py-3">
                  <StatusBadge
                    status={statusMap[asset.status].label}
                    variant={statusMap[asset.status].variant}
                  />
                </td>
                <td className="py-3 text-xs text-on-surface-variant">
                  {asset.customer || <span className="opacity-40">Sin asignar</span>}
                </td>
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant">{asset.expirationDate}</span>
                    {asset.daysRemaining !== null && (
                      <span className={cn("text-[10px]", getExpirationStyle(asset.daysRemaining))}>
                        {asset.daysRemaining} días
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 text-[10px] text-on-surface-variant">{asset.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Mostrando {filteredAssets.length} de 1,245 activos</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 bg-primary text-on-primary text-[10px] font-semibold rounded-lg">1</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">2</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">3</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">...</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">125</button>
        </div>
      </div>
    </div>
  )
}
