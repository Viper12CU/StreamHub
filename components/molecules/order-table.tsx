"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  product: string
  platform: string
  amount: number
  paymentMethod: string
  status: "pending" | "payment_submitted" | "payment_review" | "approved" | "inventory_assigned" | "delivered" | "cancelled" | "refunded"
  createdDate: string
  lastUpdated: string
}

interface OrderTableProps {
  selectedOrders: string[]
  onSelectOrders: (ids: string[]) => void
  onViewOrder: (id: string) => void
  activeTab: string
}

const orders: Order[] = [
  { id: "ORD-000482", orderNumber: "ORD-2026-000482", customerName: "Alex Murphy", customerEmail: "alex.murphy@gmail.com", product: "Netflix Premium 4 Screens", platform: "Netflix", amount: 8.99, paymentMethod: "Zelle", status: "delivered", createdDate: "Jun 5, 2026", lastUpdated: "2 horas" },
  { id: "ORD-000481", orderNumber: "ORD-2026-000481", customerName: "Sarah Chen", customerEmail: "sarah.chen@outlook.com", product: "Spotify Family", platform: "Spotify", amount: 14.99, paymentMethod: "Transfermóvil", status: "approved", createdDate: "Jun 5, 2026", lastUpdated: "3 horas" },
  { id: "ORD-000480", orderNumber: "ORD-2026-000480", customerName: "Jordan Smith", customerEmail: "jordan.smith@yahoo.com", product: "Disney+ Premium", platform: "Disney+", amount: 7.99, paymentMethod: "MLC", status: "payment_review", createdDate: "Jun 5, 2026", lastUpdated: "5 horas" },
  { id: "ORD-000479", orderNumber: "ORD-2026-000479", customerName: "Luna Rodriguez", customerEmail: "luna.r@gmail.com", product: "YouTube Premium", platform: "YouTube Premium", amount: 9.99, paymentMethod: "Zelle", status: "pending", createdDate: "Jun 5, 2026", lastUpdated: "6 horas" },
  { id: "ORD-000478", orderNumber: "ORD-2026-000478", customerName: "Marcus V.", customerEmail: "marcus.v@hotmail.com", product: "HBO Max Ultra", platform: "HBO Max", amount: 11.99, paymentMethod: "Transfermóvil", status: "inventory_assigned", createdDate: "Jun 4, 2026", lastUpdated: "1 día" },
  { id: "ORD-000477", orderNumber: "ORD-2026-000477", customerName: "Elena Kas", customerEmail: "elena.kas@gmail.com", product: "Crunchyroll Mega", platform: "Crunchyroll", amount: 6.99, paymentMethod: "Zelle", status: "delivered", createdDate: "Jun 4, 2026", lastUpdated: "1 día" },
  { id: "ORD-000476", orderNumber: "ORD-2026-000476", customerName: "Carlos M.", customerEmail: "carlos.m@live.com", product: "Netflix Standard", platform: "Netflix", amount: 5.99, paymentMethod: "MLC", status: "cancelled", createdDate: "Jun 4, 2026", lastUpdated: "2 días" },
  { id: "ORD-000475", orderNumber: "ORD-2026-000475", customerName: "María García", customerEmail: "maria.g@gmail.com", product: "IPTV Premium", platform: "IPTV", amount: 12.99, paymentMethod: "Transfermóvil", status: "delivered", createdDate: "Jun 4, 2026", lastUpdated: "2 días" },
  { id: "ORD-000474", orderNumber: "ORD-2026-000474", customerName: "David Lee", customerEmail: "david.lee@yahoo.com", product: "Spotify Individual", platform: "Spotify", amount: 4.99, paymentMethod: "Zelle", status: "payment_submitted", createdDate: "Jun 3, 2026", lastUpdated: "3 días" },
  { id: "ORD-000473", orderNumber: "ORD-2026-000473", customerName: "Ana López", customerEmail: "ana.lopez@outlook.com", product: "Netflix Premium 4 Screens", platform: "Netflix", amount: 8.99, paymentMethod: "MLC", status: "refunded", createdDate: "Jun 3, 2026", lastUpdated: "3 días" },
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

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  pending: { label: "Pendiente", variant: "warning" },
  payment_submitted: { label: "Pago Enviado", variant: "neutral" },
  payment_review: { label: "Revisión de Pago", variant: "warning" },
  approved: { label: "Aprobada", variant: "success" },
  inventory_assigned: { label: "Inventario Asignado", variant: "success" },
  delivered: { label: "Entregada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "error" },
  refunded: { label: "Reembolsada", variant: "error" },
}

const paymentMethodIcons: Record<string, string> = {
  Zelle: "Z",
  Transfermóvil: "TM",
  MLC: "M",
}

export function OrderTable({ selectedOrders, onSelectOrders, onViewOrder, activeTab }: OrderTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((o) => {
        if (activeTab === "pending") return o.status === "pending"
        if (activeTab === "payment_review") return o.status === "payment_review" || o.status === "payment_submitted"
        if (activeTab === "approved") return o.status === "approved"
        if (activeTab === "inventory_assignment") return o.status === "inventory_assigned"
        if (activeTab === "delivered") return o.status === "delivered"
        if (activeTab === "cancelled") return o.status === "cancelled" || o.status === "refunded"
        return true
      })

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectOrders([])
    } else {
      onSelectOrders(filteredOrders.map((o) => o.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectOrder = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = selectedOrders.includes(id)
      ? selectedOrders.filter((oid) => oid !== id)
      : [...selectedOrders, id]
    onSelectOrders(updated)
    setSelectAll(updated.length === filteredOrders.length)
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-base font-semibold text-on-surface">Gestión de Órdenes</h3>
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
              <th className="py-3">Orden</th>
              <th className="py-3">Cliente</th>
              <th className="py-3">Producto</th>
              <th className="py-3">Plataforma</th>
              <th className="py-3">Monto</th>
              <th className="py-3">Pago</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Creada</th>
              <th className="py-3">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onViewOrder(order.id)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(e, order.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-primary"
                  />
                </td>
                <td className="py-3 text-xs font-semibold text-primary">{order.orderNumber}</td>
                <td className="py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-on-surface">{order.customerName}</span>
                    <span className="text-[10px] text-on-surface-variant">{order.customerEmail}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-on-surface max-w-[150px] truncate">{order.product}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", platformColors[order.platform] || "bg-surface-container-highest")} />
                    <span className="text-xs text-on-surface-variant">{order.platform}</span>
                  </div>
                </td>
                <td className="py-3 text-xs font-semibold text-on-surface">${order.amount.toFixed(2)}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold",
                      order.paymentMethod === "Zelle" ? "bg-purple-500/20 text-purple-400" :
                      order.paymentMethod === "Transfermóvil" ? "bg-green-500/20 text-green-400" :
                      "bg-amber-500/20 text-amber-400"
                    )}>
                      {paymentMethodIcons[order.paymentMethod]}
                    </div>
                    <span className="text-xs text-on-surface-variant">{order.paymentMethod}</span>
                  </div>
                </td>
                <td className="py-3">
                  <StatusBadge
                    status={statusMap[order.status].label}
                    variant={statusMap[order.status].variant}
                  />
                </td>
                <td className="py-3 text-[10px] text-on-surface-variant">{order.createdDate}</td>
                <td className="py-3 text-[10px] text-on-surface-variant">Hace {order.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Mostrando {filteredOrders.length} de 1,248 órdenes</span>
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
