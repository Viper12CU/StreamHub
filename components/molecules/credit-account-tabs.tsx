"use client"

import { memo } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { CreditCounts } from "@/lib/api/credits"

interface CreditAccountTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: CreditCounts
  loading?: boolean
}

const tabsConfig = [
  { id: "all", label: "Todas las Cuentas", icon: "account-group" },
  { id: "with_balance", label: "Con Saldo", icon: "cash-check" },
  { id: "no_balance", label: "Sin Saldo", icon: "cash-remove" },
]

const tabColors: Record<string, string> = {
  with_balance: "text-green-400",
  no_balance: "text-on-surface-variant",
}

export const CreditAccountTabs = memo(function CreditAccountTabs({ activeTab, onTabChange, counts, loading }: CreditAccountTabsProps) {
  if (loading) {
    return (
      <section className="glass rounded-xl border border-white/5 overflow-hidden p-1">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
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
              {(counts[tab.id as keyof CreditCounts] ?? 0).toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
})
