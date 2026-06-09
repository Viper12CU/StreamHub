"use client"

import { memo, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProductAnalytics as ProductAnalyticsType } from "@/lib/api/products"

interface ProductAnalyticsProps {
  analytics: ProductAnalyticsType | null
  loading: boolean
}

function AnalyticsSkeleton() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass p-6 rounded-xl space-y-4">
          <Skeleton className="h-4 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function ProductAnalyticsInner({ analytics, loading }: ProductAnalyticsProps) {
  if (loading) return <AnalyticsSkeleton />

  if (!analytics || (analytics.top_products.length === 0 && analytics.sales_by_platform.length === 0)) {
    return (
      <div className="glass rounded-xl p-8 border border-white/5 text-center">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">bar_chart</span>
        <p className="text-sm text-on-surface-variant">Sin datos de analytics disponibles</p>
      </div>
    )
  }

  const { revenueData, maxRevenue, totalSales, platformData } = useMemo(() => {
    const revenueData = analytics.top_products.map((p) => ({
      name: p.name,
      revenue: p.revenue,
      color: p.platform_color,
    }))
    const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1)

    const totalSales = analytics.sales_by_platform.reduce((sum, p) => sum + p.count, 0)

    const platformData = analytics.sales_by_platform.map((p) => ({
      name: p.platform_name,
      count: p.count,
      percentage: totalSales > 0 ? Math.round((p.count / totalSales) * 100) : 0,
      color: p.platform_color,
    }))

    return { revenueData, maxRevenue, totalSales, platformData }
  }, [analytics])

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue by Product */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Ingresos por Producto</h3>
        {revenueData.length === 0 ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/30 block mb-1">bar_chart</span>
            <p className="text-xs text-on-surface-variant">Sin ingresos registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revenueData.map((product) => (
              <div key={product.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-on-surface truncate max-w-[150px]">{product.name}</span>
                  <span className="text-xs font-semibold text-on-surface">${product.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(product.revenue / maxRevenue) * 100}%`, backgroundColor: product.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sales by Platform */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-sm font-semibold text-on-surface mb-4">Ventas por Plataforma</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full border-[8px] border-primary-container/20 border-l-primary-container border-t-secondary relative flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-bold">{totalSales.toLocaleString()}</p>
              <p className="text-[8px] text-on-surface-variant">ventas</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {platformData.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />
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
        {analytics.growth_trends.length === 0 ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant/30 block mb-1">show_chart</span>
            <p className="text-xs text-on-surface-variant">Sin tendencias disponibles</p>
          </div>
        ) : (
          <>
            <div className="h-32 relative">
              <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {(() => {
                  const trends = analytics.growth_trends
                  const maxOrders = Math.max(...trends.map((t) => t.orders), 1)
                  const maxRevenueT = Math.max(...trends.map((t) => t.revenue), 1)
                  const orderPath = trends.map((t, i) => {
                    const x = (i / (trends.length - 1 || 1)) * 100
                    const y = 100 - (t.orders / maxOrders) * 80
                    return `${i === 0 ? "M" : "L"}${x},${y}`
                  }).join(" ")
                  const revenuePath = trends.map((t, i) => {
                    const x = (i / (trends.length - 1 || 1)) * 100
                    const y = 100 - (t.revenue / maxRevenueT) * 80
                    return `${i === 0 ? "M" : "L"}${x},${y}`
                  }).join(" ")
                  return (
                    <>
                      <path d={orderPath} fill="none" stroke="#e50914" strokeWidth="2" />
                      <path d={revenuePath} fill="none" stroke="#508eff" strokeDasharray="4" strokeWidth="2" />
                    </>
                  )
                })()}
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
          </>
        )}
      </div>
    </section>
  )
}

export const ProductAnalytics = memo(ProductAnalyticsInner)
