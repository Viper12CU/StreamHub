"use client"

import { cn } from "@/lib/utils"

interface OrderTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "all", label: "Todas las Órdenes", icon: "receipt_long", count: 1248 },
  { id: "pending", label: "Pendientes", icon: "pending", count: 18 },
  { id: "payment_review", label: "Revisión de Pago", icon: "payment", count: 7 },
  { id: "approved", label: "Aprobadas", icon: "check_circle", count: 42 },
  { id: "inventory_assignment", label: "Asignación de Inventario", icon: "inventory_2", count: 15 },
  { id: "delivered", label: "Entregadas", icon: "local_shipping", count: 1117 },
  { id: "cancelled", label: "Canceladas", icon: "cancel", count: 24 },
]

const tabColors: Record<string, string> = {
  pending: "text-amber-500",
  payment_review: "text-orange-400",
  approved: "text-green-400",
  inventory_assignment: "text-secondary",
  delivered: "text-green-400",
  cancelled: "text-error",
}

export function OrderTabs({ activeTab, onTabChange }: OrderTabsProps) {
  return (
    <section className="glass rounded-xl border border-white/5 overflow-hidden">
      <div className="flex overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2",
              activeTab === tab.id
                ? "text-primary border-primary bg-primary/[0.05]"
                : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-white/[0.02]"
            )}
          >
            <span className={cn(
              "material-symbols-outlined text-sm",
              activeTab === tab.id ? "" : (tabColors[tab.id] || "")
            )}>
              {tab.icon}
            </span>
            {tab.label}
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
              activeTab === tab.id
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant"
            )}>
              {tab.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
