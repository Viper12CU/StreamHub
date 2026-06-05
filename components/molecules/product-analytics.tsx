"use client"

import { cn } from "@/lib/utils"

const revenueByProduct = [
  { name: "Netflix Premium 4K", revenue: 10945, percentage: 38 },
  { name: "Spotify Family", revenue: 4989, percentage: 17 },
  { name: "Netflix Standard", revenue: 2598, percentage: 9 },
  { name: "Disney+ Premium", revenue: 2572, percentage: 9 },
  { name: "Spotify Individual", revenue: 2337, percentage: 8 },
]

const salesByPlatform = [
  { name: "Netflix", percentage: 47, color: "bg-primary-container" },
  { name: "Spotify", percentage: 24, color: "bg-secondary" },
  { name: "Disney+", percentage: 15, color: "bg-tertiary" },
  { name: "YouTube Premium", percentage: 8, color: "bg-[#ff0000]" },
  { name: "HBO Max", percentage: 4, color: "bg-[#b829e3]" },
  { name: "Otros", percentage: 2, color: "bg-surface-container-highest" },
]

const trendBars = [
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
  { height: "80%", active: false },
]

export function ProductAnalytics() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue by Product */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Ingresos por Producto</h3>
        <div className="space-y-3">
          {revenueByProduct.map((product) => (
            <div key={product.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-on-surface truncate max-w-[150px]">{product.name}</span>
                <span className="text-xs font-semibold text-on-surface">${product.revenue.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${product.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales by Platform */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Ventas por Plataforma</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full border-[8px] border-primary-container/20 border-l-primary-container border-t-secondary relative flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-bold">1,449</p>
              <p className="text-[8px] text-on-surface-variant">ventas</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {salesByPlatform.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", platform.color)} />
                <span className="text-xs text-on-surface-variant">{platform.name}</span>
              </div>
              <span className="text-xs font-semibold text-on-surface">{platform.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Growth Trends */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Tendencias de Crecimiento</h3>
        <div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
            +12.5% este mes
          </span>
        </div>
        <div className="h-32 relative">
          <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,80 L15,70 L30,75 L45,50 L60,40 L75,30 L90,15 L100,10" fill="none" stroke="#e50914" strokeWidth="2" />
            <path d="M0,90 L15,85 L30,88 L45,75 L60,70 L75,65 L90,60 L100,55" fill="none" stroke="#508eff" strokeDasharray="4" strokeWidth="2" />
          </svg>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-primary" />
            <span className="text-[10px] text-on-surface-variant">Ventas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-secondary" />
            <span className="text-[10px] text-on-surface-variant">Ingresos</span>
          </div>
        </div>
      </div>
    </section>
  )
}
