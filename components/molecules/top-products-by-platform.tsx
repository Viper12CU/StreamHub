"use client"

import { memo, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { PlatformWithMetrics } from "@/lib/api/platforms"

interface TopProductsByPlatformProps {
  platforms: PlatformWithMetrics[]
  loading: boolean
}

function TopProductsSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5">
            <tr>
              <th className="py-3 px-4"><Skeleton className="h-3 w-4" /></th>
              <th className="py-3"><Skeleton className="h-3 w-20" /></th>
              <th className="py-3"><Skeleton className="h-3 w-16" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-12" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-14" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-12" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4"><Skeleton className="h-3 w-4" /></td>
                <td className="py-3"><Skeleton className="h-3 w-36" /></td>
                <td className="py-3"><Skeleton className="h-3 w-20" /></td>
                <td className="py-3 text-right"><Skeleton className="h-3 w-8" /></td>
                <td className="py-3 text-right"><Skeleton className="h-3 w-14" /></td>
                <td className="py-3 text-right"><Skeleton className="h-3 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TopProductsByPlatformInner({ platforms, loading }: TopProductsByPlatformProps) {
  if (loading) return <TopProductsSkeleton />

  if (platforms.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/5 text-center">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">emoji_events</span>
        <p className="text-sm text-on-surface-variant">Sin datos de productos</p>
      </div>
    )
  }

  const topProducts = useMemo(() => {
    return [...platforms]
      .filter((p) => p.revenue_monthly > 0)
      .sort((a, b) => b.revenue_monthly - a.revenue_monthly)
      .slice(0, 8)
      .map((p, i) => ({
        rank: i + 1,
        name: p.best_selling_product || p.name,
        platform: p.name,
        platformColor: p.color,
        orders: p.total_orders,
        revenue: p.revenue_monthly,
        inventory: p.inventory_available,
      }))
  }, [platforms])

  if (topProducts.length === 0) {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface">Top Productos por Plataforma</h3>
        </div>
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">emoji_events</span>
          <p className="text-xs text-on-surface-variant">Sin datos de productos para mostrar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500 text-sm">emoji_events</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface">Top Productos por Plataforma</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4" scope="col">#</th>
              <th className="py-3" scope="col">Producto</th>
              <th className="py-3" scope="col">Plataforma</th>
              <th className="py-3 text-right" scope="col">Órdenes</th>
              <th className="py-3 text-right" scope="col">Ingresos</th>
              <th className="py-3 text-right" scope="col">Inventario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {topProducts.map((product) => (
              <tr key={product.rank} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-3 px-4 text-[10px] font-bold text-on-surface-variant">{product.rank}</td>
                <td className="py-3 text-xs font-medium text-on-surface">{product.name}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.platformColor }} />
                    <span className="text-xs text-on-surface-variant">{product.platform}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-on-surface text-right">{product.orders}</td>
                <td className="py-3 text-xs font-semibold text-primary text-right">${product.revenue.toLocaleString()}</td>
                <td className="py-3 text-xs text-on-surface-variant text-right">{product.inventory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const TopProductsByPlatform = memo(TopProductsByPlatformInner)
