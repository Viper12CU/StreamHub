"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface OrderTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "all", label: "Todas las Órdenes", icon: "receipt", count: 1248 },
  { id: "pending", label: "Pendientes", icon: "clock-outline", count: 18 },
  { id: "payment_review", label: "Revisión de Pago", icon: "credit-card", count: 7 },
  { id: "approved", label: "Aprobadas", icon: "check-circle", count: 42 },
  { id: "inventory_assignment", label: "Asignación de Inventario", icon: "package-variant", count: 15 },
  { id: "delivered", label: "Entregadas", icon: "truck", count: 1117 },
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
            <Icon name={tab.icon} className={cn(
              "text-sm",
              activeTab === tab.id ? "" : (tabColors[tab.id] || "")
            )} />
            {tab.label}
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
              activeTab === tab.id
                ? "bg-primary text-white"
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
