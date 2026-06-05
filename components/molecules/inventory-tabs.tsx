"use client"

import { cn } from "@/lib/utils"

interface InventoryTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "all", label: "Todo el Inventario", icon: "inventory_2", count: 1245 },
  { id: "accounts", label: "Cuentas", icon: "person", count: 542 },
  { id: "profiles", label: "Perfiles Compartidos", icon: "group", count: 312 },
  { id: "codes", label: "Códigos de Activación", icon: "vpn_key", count: 289 },
  { id: "packages", label: "Paquetes de Suscripción", icon: "inventory", count: 102 },
]

export function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
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
                ? "bg-primary text-on-primary"
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
