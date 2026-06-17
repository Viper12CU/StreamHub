"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

const chartBars = [
  { height: "40%", active: false },
  { height: "55%", active: false },
  { height: "75%", active: false },
  { height: "60%", active: false },
  { height: "45%", active: false },
  { height: "95%", active: true },
  { height: "40%", active: false },
  { height: "55%", active: false },
  { height: "75%", active: false },
  { height: "60%", active: false },
  { height: "45%", active: false },
]

const filters = ["7 Días", "30 Días", "90 Días", "12 Meses"]

export function RevenueChart() {
  const [activeFilter, setActiveFilter] = useState("30 Días")

  return (
    <div className="glass p-6 rounded-xl min-h-[400px] flex flex-col lg:col-span-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-semibold text-on-surface">Resumen de Ingresos</h3>
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-md transition-colors",
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "hover:bg-white/5 text-on-surface-variant"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <Icon name="trending-up" className="text-sm text-primary" />
          Tendencia: +12.5%
        </span>
        <span>Promedio por orden: <span className="font-semibold text-on-surface">$37.96</span></span>
      </div>
      <div className="flex-1 flex items-end gap-2 w-full relative">
        {chartBars.map((bar, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t-sm transition-colors cursor-pointer",
              bar.active
                ? "bg-primary-container"
                : "bg-primary/20 hover:bg-primary"
            )}
            style={{ height: bar.height }}
          />
        ))}
        <div className="absolute bottom-0 left-0 w-full border-b border-white/10" />
      </div>
      <div className="mt-4 flex justify-between text-[10px] text-on-surface-variant uppercase tracking-widest opacity-50">
        <span>Oct 01</span>
        <span>Oct 15</span>
        <span>Hoy</span>
      </div>
    </div>
  )
}
