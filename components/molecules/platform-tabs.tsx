"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PlatformTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: { all: number; active: number; inactive: number; archived: number }
  loading?: boolean
}

const tabsConfig = [
  { id: "all", label: "Todas las Plataformas", icon: "smart_display" },
  { id: "active", label: "Activas", icon: "check_circle" },
  { id: "inactive", label: "Inactivas", icon: "pause_circle" },
  { id: "archived", label: "Archivadas", icon: "archive" },
]

const tabColors: Record<string, string> = {
  active: "text-green-400",
  inactive: "text-amber-500",
  archived: "text-on-surface-variant",
}

export function PlatformTabs({ activeTab, onTabChange, counts, loading }: PlatformTabsProps) {
  if (loading) {
    return (
      <section className="glass rounded-xl border border-white/5 overflow-hidden p-1">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
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
              {counts[tab.id as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
