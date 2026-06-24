"use client"

import { memo } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { CustomerCounts } from "@/lib/api/customers"

interface CustomerTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: CustomerCounts
  loading?: boolean
}

const tabsConfig = [
  { id: "all", label: "Todos los Clientes", icon: "account-group" },
  { id: "active", label: "Activos", icon: "check-circle" },
  { id: "inactive", label: "Inactivos", icon: "account-off" },
  { id: "vip", label: "VIP", icon: "diamond" },
  { id: "pending", label: "En Riesgo", icon: "warning" },
  { id: "suspended", label: "Suspendidos", icon: "block" },
]

const tabColors: Record<string, string> = {
  active: "text-green-400",
  inactive: "text-on-surface-variant",
  vip: "text-amber-500",
  pending: "text-orange-400",
  suspended: "text-error",
}

export const CustomerTabs = memo(function CustomerTabs({ activeTab, onTabChange, counts, loading }: CustomerTabsProps) {
  if (loading) {
    return (
      <section className="glass rounded-xl border border-white/5 overflow-hidden p-1">
        <div className="flex gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 flex-1 rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="glass rounded-xl border border-white/5 overflow-hidden">
      <div role="tablist" className="flex overflow-x-auto custom-scrollbar">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
              activeTab === tab.id
                ? "text-primary border-primary bg-primary/[0.05]"
                : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-white/[0.02]"
            )}
          >
            <Icon
              name={tab.icon}
              className={cn(
                "text-sm",
                activeTab === tab.id ? "" : (tabColors[tab.id] || "")
              )}
            />
            {tab.label}
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-surface-container-high text-on-surface-variant"
            )}>
              {(counts[tab.id as keyof CustomerCounts] ?? 0).toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
})
