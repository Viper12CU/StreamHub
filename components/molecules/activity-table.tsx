"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/atoms/status-badge"

interface Activity {
  id: string
  customer: string
  product: string
  paymentMethod: string
  amount: string
  status: "approved" | "pending" | "payment_review" | "delivered" | "cancelled"
  date: string
}

const activities: Activity[] = [
  { id: "#ORD-9021", customer: "Alex Murphy", product: "Netflix Premium 4K", paymentMethod: "Tarjeta", amount: "$24.99", status: "approved", date: "2 min" },
  { id: "#ORD-9018", customer: "Jordan Smith", product: "Spotify 1yr", paymentMethod: "PayPal", amount: "$15.00", status: "pending", date: "15 min" },
  { id: "#ORD-9015", customer: "Elena Kas", product: "Disney+ Promo", paymentMethod: "Tarjeta", amount: "$12.99", status: "payment_review", date: "32 min" },
  { id: "#ORD-9012", customer: "Marcus V.", product: "Netflix Standard", paymentMethod: "Transferencia", amount: "$18.50", status: "delivered", date: "1h" },
  { id: "#ORD-9008", customer: "Sarah Chen", product: "YouTube Premium", paymentMethod: "Tarjeta", amount: "$11.99", status: "approved", date: "1h 30min" },
  { id: "#ORD-9005", customer: "David Park", product: "HBO Max", paymentMethod: "PayPal", amount: "$14.99", status: "approved", date: "2h" },
  { id: "#ORD-9001", customer: "Luna Rodriguez", product: "Spotify Family", paymentMethod: "Tarjeta", amount: "$19.99", status: "cancelled", date: "2h 45min" },
  { id: "#ORD-8998", customer: "Ryan O'Connor", product: "Crunchyroll", paymentMethod: "Transferencia", amount: "$7.99", status: "delivered", date: "3h" },
  { id: "#ORD-8995", customer: "Mia Tanaka", product: "Netflix Premium 4K", paymentMethod: "Tarjeta", amount: "$24.99", status: "approved", date: "3h 20min" },
  { id: "#ORD-8992", customer: "Carlos Mendez", product: "Disney+ + ESPN", paymentMethod: "PayPal", amount: "$16.99", status: "pending", date: "4h" },
]

const statusMap = {
  approved: { label: "Aprobado", variant: "success" as const },
  pending: { label: "Pendiente", variant: "warning" as const },
  payment_review: { label: "Payment Review", variant: "warning" as const },
  delivered: { label: "Entregado", variant: "success" as const },
  cancelled: { label: "Cancelado", variant: "error" as const },
}

export function ActivityTable() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <div className="glass p-6 rounded-xl lg:col-span-9">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-on-surface">Órdenes Recientes</h3>
        <button className="text-primary text-xs font-semibold hover:underline">Ver todas las órdenes</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-xs font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Cliente</th>
              <th className="py-2">Producto</th>
              <th className="py-2">Método</th>
              <th className="py-2">Monto</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Fecha</th>
              <th className="py-2 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-3 text-xs font-semibold text-primary">{activity.id}</td>
                <td className="py-3 text-sm">{activity.customer}</td>
                <td className="py-3 text-sm">{activity.product}</td>
                <td className="py-3 text-xs text-on-surface-variant">{activity.paymentMethod}</td>
                <td className="py-3 text-sm font-semibold">{activity.amount}</td>
                <td className="py-3">
                  <StatusBadge
                    status={statusMap[activity.status].label}
                    variant={statusMap[activity.status].variant}
                  />
                </td>
                <td className="py-3 text-xs text-on-surface-variant">{activity.date}</td>
                <td className="py-3 text-right relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === activity.id ? null : activity.id)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-on-surface"
                  >
                    more_vert
                  </button>
                  {openMenu === activity.id && (
                    <div className="absolute right-0 top-8 z-10 w-40 bg-surface-container-low border border-white/10 rounded-lg shadow-xl py-1">
                      <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility</span> Ver orden
                      </button>
                      <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-sm">check_circle</span> Aprobar
                      </button>
                      <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2 text-error">
                        <span className="material-symbols-outlined text-sm">cancel</span> Rechazar
                      </button>
                      <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">local_shipping</span> Marcar entregado
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
