"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Icon } from "@/components/atoms/icon"
import type { ProductAnalytics } from "@/lib/api/products"

interface TopPerformersProps {
  topProducts: ProductAnalytics["top_products"] | null
  loading: boolean
}

function PerformersSkeleton() {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <Skeleton className="h-4 w-40" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton variant="circle" className="w-6 h-6" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2 w-16" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-3 w-8 ml-auto" />
            <Skeleton className="h-2 w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TopPerformersInner({ topProducts, loading }: TopPerformersProps) {
  if (loading) return <PerformersSkeleton />

  if (!topProducts || topProducts.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/5 text-center">
        <Icon name="emoticon-outline" className="text-3xl text-on-surface-variant/30 mb-2 block" />
        <p className="text-xs text-on-surface-variant">Sin datos de productos</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
        <Icon name="emoticon-outline" className="text-sm text-primary" />
        Mejores Vendedores
      </h3>
      <div className="space-y-2">
        {topProducts.map((product, i) => {
          const rank = i + 1
          return (
            <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
              <span className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                rank === 1 ? "bg-primary text-white" :
                rank === 2 ? "bg-secondary text-on-secondary" :
                rank === 3 ? "bg-amber-500 text-black" :
                "bg-surface-container-high text-on-surface-variant"
              )}>
                {rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">{product.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.platform_color }} />
                  <span className="text-[10px] text-on-surface-variant">{product.platform_name}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-on-surface">{product.orders}</p>
                <p className="text-[10px] text-on-surface-variant">${product.revenue.toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const TopPerformers = memo(TopPerformersInner)
