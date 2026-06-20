"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface OfferTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: Record<string, number>
}

const tabs = [
  { id: "all", label: "Todas", icon: "tag-multiple" },
  { id: "active", label: "Activas", icon: "check-circle" },
  { id: "inactive", label: "Inactivas", icon: "pause-circle" },
  { id: "expired", label: "Expiradas", icon: "clock-alert" },
]

const tabColors: Record<string, string> = {
  active: "text-green-400",
  inactive: "text-amber-500",
  expired: "text-error",
}

export function OfferTabs({ activeTab, onTabChange, counts }: OfferTabsProps) {
  return (
    <section className="glass rounded-xl border border-white/5 overflow-hidden">
      <div className="flex overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const count = counts[tab.id] ?? 0
          return (
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
              <Icon
                name={tab.icon}
                className={cn(
                  "text-sm",
                  activeTab === tab.id ? "" : (tabColors[tab.id] || "")
                )}
              />
              {tab.label}
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface-variant"
                )}
              >
                {count.toLocaleString()}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
