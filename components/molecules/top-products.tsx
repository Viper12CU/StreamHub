"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/components/atoms/icon"
import { getProductAnalytics, type ProductAnalyticsData } from "@/lib/api/products"

export function TopProducts() {
  const [data, setData] = useState<ProductAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const products = data?.top_products || []

  return (
    <div className="glass p-6 rounded-xl lg:col-span-5">
      <h3 className="text-2xl font-semibold text-on-surface mb-4">Top Productos</h3>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg skeleton-shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Icon name="package-variant" className="text-4xl text-on-surface-variant/30 mb-2" />
          <p className="text-xs text-on-surface-variant">Sin datos de productos</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Producto</th>
                <th className="pb-2 pr-2">Plataforma</th>
                <th className="pb-2 pr-2 text-right">Ventas</th>
                <th className="pb-2 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.slice(0, 10).map((product, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 text-xs text-on-surface-variant">{i + 1}</td>
                  <td className="py-2 text-xs font-semibold text-on-surface">{product.name}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.platform_color }} />
                      <span className="text-[10px] text-on-surface-variant">{product.platform_name}</span>
                    </div>
                  </td>
                  <td className="py-2 text-xs font-semibold text-primary text-right">{product.orders}</td>
                  <td className="py-2 text-xs text-on-surface-variant text-right">${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
