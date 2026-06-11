"use client"

import { cn } from "@/lib/utils"

interface InventoryTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts?: Record<string, number>
}

const defaultTabs = [
  { id: "all", label: "Todo el Inventario", icon: "inventory_2" },
  { id: "accounts", label: "Cuentas", icon: "person" },
  { id: "profiles", label: "Perfiles Compartidos", icon: "group" },
  { id: "codes", label: "Códigos de Activación", icon: "vpn_key" },
  { id: "packages", label: "Paquetes de Suscripción", icon: "inventory" },
]

export function InventoryTabs({ activeTab, onTabChange, counts = {} }: InventoryTabsProps) {
  const tabs = defaultTabs.map((t) => ({ ...t, count: counts[t.id] ?? 0 }))
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
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.label}
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-surface-container-high text-on-surface-variant"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
