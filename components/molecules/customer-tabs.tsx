"use client"

import { cn } from "@/lib/utils"

interface CustomerTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "all", label: "Todos los Clientes", icon: "group", count: 3482 },
  { id: "active", label: "Activos", icon: "check_circle", count: 2965 },
  { id: "inactive", label: "Inactivos", icon: "person_off", count: 374 },
  { id: "vip", label: "VIP", icon: "diamond", count: 118 },
  { id: "pending", label: "Órdenes Pendientes", icon: "pending", count: 42 },
  { id: "suspended", label: "Suspendidos", icon: "block", count: 25 },
]

const tabColors: Record<string, string> = {
  active: "text-green-400",
  inactive: "text-on-surface-variant",
  vip: "text-amber-500",
  pending: "text-orange-400",
  suspended: "text-error",
}

export function CustomerTabs({ activeTab, onTabChange }: CustomerTabsProps) {
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
