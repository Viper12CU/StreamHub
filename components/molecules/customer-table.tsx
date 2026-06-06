"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"

interface Customer {
  id: string
  customerId: string
  name: string
  email: string
  avatar: string
  totalOrders: number
  lifetimeValue: number
  activeSubscriptions: number
  lastPurchase: string
  status: "active" | "vip" | "inactive" | "suspended"
  joinedDate: string
}

interface CustomerTableProps {
  selectedCustomers: string[]
  onSelectCustomers: (ids: string[]) => void
  onViewCustomer: (id: string) => void
  activeTab: string
}

const customers: Customer[] = [
  { id: "CUS-000421", customerId: "CUS-2026-000421", name: "Alex Murphy", email: "alex.murphy@gmail.com", avatar: "AM", totalOrders: 18, lifetimeValue: 324.50, activeSubscriptions: 3, lastPurchase: "2 días", status: "vip", joinedDate: "Ene 12, 2026" },
  { id: "CUS-000420", customerId: "CUS-2026-000420", name: "Sarah Chen", email: "sarah.chen@outlook.com", avatar: "SC", totalOrders: 12, lifetimeValue: 189.90, activeSubscriptions: 2, lastPurchase: "1 día", status: "active", joinedDate: "Feb 3, 2026" },
  { id: "CUS-000419", customerId: "CUS-2026-000419", name: "Jordan Smith", email: "jordan.smith@yahoo.com", avatar: "JS", totalOrders: 8, lifetimeValue: 95.80, activeSubscriptions: 1, lastPurchase: "5 días", status: "active", joinedDate: "Feb 18, 2026" },
  { id: "CUS-000418", customerId: "CUS-2026-000418", name: "Luna Rodriguez", email: "luna.r@gmail.com", avatar: "LR", totalOrders: 3, lifetimeValue: 42.97, activeSubscriptions: 1, lastPurchase: "1 semana", status: "active", joinedDate: "Mar 1, 2026" },
  { id: "CUS-000417", customerId: "CUS-2026-000417", name: "Marcus V.", email: "marcus.v@hotmail.com", avatar: "MV", totalOrders: 22, lifetimeValue: 456.78, activeSubscriptions: 4, lastPurchase: "3 días", status: "vip", joinedDate: "Ene 5, 2026" },
  { id: "CUS-000416", customerId: "CUS-2026-000416", name: "Elena Kas", email: "elena.kas@gmail.com", avatar: "EK", totalOrders: 6, lifetimeValue: 71.94, activeSubscriptions: 1, lastPurchase: "2 semanas", status: "active", joinedDate: "Mar 10, 2026" },
  { id: "CUS-000415", customerId: "CUS-2026-000415", name: "Carlos M.", email: "carlos.m@live.com", avatar: "CM", totalOrders: 1, lifetimeValue: 5.99, activeSubscriptions: 0, lastPurchase: "1 mes", status: "inactive", joinedDate: "Abr 15, 2026" },
  { id: "CUS-000414", customerId: "CUS-2026-000414", name: "María García", email: "maria.g@gmail.com", avatar: "MG", totalOrders: 15, lifetimeValue: 267.85, activeSubscriptions: 2, lastPurchase: "4 días", status: "active", joinedDate: "Feb 8, 2026" },
  { id: "CUS-000413", customerId: "CUS-2026-000413", name: "David Lee", email: "david.lee@yahoo.com", avatar: "DL", totalOrders: 0, lifetimeValue: 0, activeSubscriptions: 0, lastPurchase: "Nunca", status: "suspended", joinedDate: "May 20, 2026" },
  { id: "CUS-000412", customerId: "CUS-2026-000412", name: "Ana López", email: "ana.lopez@outlook.com", avatar: "AL", totalOrders: 9, lifetimeValue: 127.91, activeSubscriptions: 1, lastPurchase: "6 días", status: "active", joinedDate: "Mar 22, 2026" },
]

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  vip: { label: "VIP", variant: "warning" },
  inactive: { label: "Inactivo", variant: "neutral" },
  suspended: { label: "Suspendido", variant: "error" },
}

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-amber-500/20 text-amber-500",
  "bg-purple-500/20 text-purple-400",
  "bg-green-500/20 text-green-400",
]

export function CustomerTable({ selectedCustomers, onSelectCustomers, onViewCustomer, activeTab }: CustomerTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const filteredCustomers = activeTab === "all"
    ? customers
    : customers.filter((c) => {
        if (activeTab === "active") return c.status === "active"
        if (activeTab === "inactive") return c.status === "inactive"
        if (activeTab === "vip") return c.status === "vip"
        if (activeTab === "pending") return c.activeSubscriptions > 0 && c.status !== "suspended"
        if (activeTab === "suspended") return c.status === "suspended"
        return true
      })

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectCustomers([])
    } else {
      onSelectCustomers(filteredCustomers.map((c) => c.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectCustomer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = selectedCustomers.includes(id)
      ? selectedCustomers.filter((cid) => cid !== id)
      : [...selectedCustomers, id]
    onSelectCustomers(updated)
    setSelectAll(updated.length === filteredCustomers.length)
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-base font-semibold text-on-surface">Directorio de Clientes</h3>
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
              <th className="py-3">Cliente</th>
              <th className="py-3">ID</th>
              <th className="py-3">Órdenes</th>
              <th className="py-3">Valor Vida</th>
              <th className="py-3">Suscripciones</th>
              <th className="py-3">Última Compra</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCustomers.map((customer, i) => (
              <tr
                key={customer.id}
                onClick={() => onViewCustomer(customer.id)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={(e) => handleSelectCustomer(e, customer.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-primary"
                  />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      avatarColors[i % avatarColors.length]
                    )}>
                      {customer.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">{customer.name}</span>
                      <span className="text-[10px] text-on-surface-variant">{customer.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-[10px] font-semibold text-primary">{customer.customerId}</td>
                <td className="py-3 text-xs text-on-surface">{customer.totalOrders} Órdenes</td>
                <td className="py-3 text-xs font-semibold text-on-surface">${customer.lifetimeValue.toFixed(2)}</td>
                <td className="py-3 text-xs text-on-surface-variant">{customer.activeSubscriptions} Activas</td>
                <td className="py-3 text-[10px] text-on-surface-variant">
                  {customer.lastPurchase === "Nunca" ? (
                    <span className="opacity-40">Nunca</span>
                  ) : (
                    `Hace ${customer.lastPurchase}`
                  )}
                </td>
                <td className="py-3">
                  <StatusBadge
                    status={statusMap[customer.status].label}
                    variant={statusMap[customer.status].variant}
                  />
                </td>
                <td className="py-3 text-[10px] text-on-surface-variant">{customer.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Mostrando {filteredCustomers.length} de 3,482 clientes</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 bg-primary text-white text-[10px] font-semibold rounded-lg">1</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">2</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">3</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">...</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">349</button>
        </div>
      </div>
    </div>
  )
}
