"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface InventoryTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts?: Record<string, number>
}

const defaultTabs = [
  { id: "all", label: "Todo el Inventario", icon: "package-variant-closed" },
  { id: "accounts", label: "Cuentas", icon: "account" },
  { id: "profiles", label: "Perfiles Compartidos", icon: "account-group" },
  { id: "codes", label: "Códigos de Activación", icon: "key" },
  { id: "packages", label: "Paquetes de Suscripción", icon: "package" },
]

export const InventoryTabs = memo(function InventoryTabs({ activeTab, onTabChange, counts = {} }: InventoryTabsProps) {
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
            <Icon name={tab.icon} className="text-sm" />
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
})
