"use client"

import { memo } from "react"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProductHealth } from "@/lib/api/products"

interface InventoryInsightsProps {
  health: ProductHealth | null
  loading: boolean
}

function InsightsSkeleton() {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <Skeleton className="h-4 w-40" />
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-2">
          <Skeleton className="h-2.5 w-20" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function InventoryInsightsInner({ health, loading }: InventoryInsightsProps) {
  if (loading) return <InsightsSkeleton />

  if (!health) return null

  const hasAnyData = health.low_stock_products.length > 0 || health.out_of_stock_products.length > 0 || health.most_stocked_products.length > 0

  if (!hasAnyData) {
    return (
      <div className="glass rounded-xl p-8 border border-white/5 text-center">
        <Icon name="check-circle" className="text-3xl text-green-400/30 mb-2 block" />
        <p className="text-xs text-on-surface-variant">Inventario saludable</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
        <Icon name="package-variant-closed" className="text-sm text-primary" />
        Salud del Inventario
      </h3>

      {/* Products Running Low */}
      {health.low_stock_products.length > 0 && (
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase mb-2">Stock Bajo</p>
          <div className="space-y-2">
            {health.low_stock_products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                <span className="text-xs text-on-surface">{product.name}</span>
                <span className="text-[10px] font-semibold text-amber-500">{product.available_units} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Out of Stock */}
      {health.out_of_stock_products.length > 0 && (
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase mb-2">Sin Stock</p>
          <div className="space-y-2">
            {health.out_of_stock_products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-error/10 rounded-lg">
                <span className="text-xs text-on-surface">{product.name}</span>
                <span className="text-[10px] font-semibold text-error">Reponer</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Stocked */}
      {health.most_stocked_products.length > 0 && (
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase mb-2">Mayor Stock</p>
          <div className="space-y-2">
            {health.most_stocked_products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                <span className="text-xs text-on-surface">{product.name}</span>
                <span className="text-[10px] font-semibold text-green-400">{product.available_units} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const InventoryInsights = memo(InventoryInsightsInner)
