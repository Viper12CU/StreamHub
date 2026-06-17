"use client"

import { memo, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Icon } from "@/components/atoms/icon"
import type { PlatformWithMetrics } from "@/lib/api/platforms"

interface PlatformAnalyticsProps {
  platforms: PlatformWithMetrics[]
  loading: boolean
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass p-5 rounded-xl border border-white/5 space-y-4">
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
    </div>
  )
}

function PlatformAnalyticsInner({ platforms, loading }: PlatformAnalyticsProps) {
  if (loading) return <AnalyticsSkeleton />

  if (platforms.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/5 text-center">
        <Icon name="chart-bar" className="text-3xl text-on-surface-variant/30 mb-2 block" />
        <p className="text-sm text-on-surface-variant">Sin datos de analytics</p>
      </div>
    )
  }

  const { revenueData, maxRevenue, ordersData, maxOrders, inventoryData, customerData, maxCustomers } = useMemo(() => {
    const revenueData = platforms
      .filter((p) => p.revenue_monthly > 0)
      .sort((a, b) => b.revenue_monthly - a.revenue_monthly)
      .slice(0, 8)
      .map((p) => ({
        name: p.name,
        revenue: p.revenue_monthly,
        bgColor: p.color,
      }))

    const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1)

    const ordersData = platforms
      .filter((p) => p.total_orders > 0)
      .sort((a, b) => b.total_orders - a.total_orders)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        orders: p.total_orders,
        bgColor: p.color,
      }))

    const maxOrders = Math.max(...ordersData.map((d) => d.orders), 1)

    const inventoryData = platforms
      .filter((p) => p.inventory_available > 0 || p.inventory_assigned > 0)
      .sort((a, b) => (b.inventory_available + b.inventory_assigned) - (a.inventory_available + a.inventory_assigned))
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        available: p.inventory_available,
        assigned: p.inventory_assigned,
      }))

    const customerData = platforms
      .filter((p) => p.customer_count > 0)
      .sort((a, b) => b.customer_count - a.customer_count)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        customers: p.customer_count,
        bgColor: p.color,
      }))

    const maxCustomers = Math.max(...customerData.map((d) => d.customers), 1)

    return { revenueData, maxRevenue, ordersData, maxOrders, inventoryData, customerData, maxCustomers }
  }, [platforms])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Revenue by Platform */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="chart-bar" className="text-sm text-primary" />
          Ingresos por Plataforma
        </h3>
        {revenueData.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="chart-bar" className="text-2xl text-on-surface-variant/30 block mb-1" />
            <p className="text-xs text-on-surface-variant">Sin ingresos registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revenueData.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface">{item.name}</span>
                  <span className="text-xs font-semibold text-on-surface">${item.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 min-w-[2px]"
                    style={{
                      width: `${(item.revenue / maxRevenue) * 100}%`,
                      backgroundColor: item.bgColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders by Platform */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="receipt" className="text-sm text-primary" />
          Órdenes por Plataforma
        </h3>
        {ordersData.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="receipt" className="text-2xl text-on-surface-variant/30 block mb-1" />
            <p className="text-xs text-on-surface-variant">Sin órdenes registradas</p>
          </div>
        ) : (
          <div className="flex items-end gap-3 h-40">
            {ordersData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-on-surface">{item.orders}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-500 min-h-[2px]"
                  style={{
                    height: `${(item.orders / maxOrders) * 100}%`,
                    backgroundColor: item.bgColor,
                  }}
                />
                <span className="text-[10px] text-on-surface-variant text-center leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory Distribution */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="package-variant" className="text-sm text-primary" />
          Distribución de Inventario
        </h3>
        {inventoryData.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="package-variant" className="text-2xl text-on-surface-variant/30 block mb-1" />
            <p className="text-xs text-on-surface-variant">Sin inventario registrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inventoryData.map((item, i) => {
              const total = item.available + item.assigned
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface">{item.name}</span>
                    <span className="text-[10px] text-on-surface-variant">{total} total</span>
                  </div>
                  <div className="flex h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="bg-green-400 h-full rounded-l-full transition-all duration-500"
                      style={{ width: `${total > 0 ? (item.available / total) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-primary h-full rounded-r-full transition-all duration-500"
                      style={{ width: `${total > 0 ? (item.assigned / total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[10px] text-green-400">{item.available} disponibles</span>
                    <span className="text-[10px] text-primary">{item.assigned} asignados</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Customer Distribution */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="account-group" className="text-sm text-primary" />
          Distribución de Clientes
        </h3>
        {customerData.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="account-group" className="text-2xl text-on-surface-variant/30 block mb-1" />
            <p className="text-xs text-on-surface-variant">Sin clientes registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customerData.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface">{item.name}</span>
                  <span className="text-xs font-semibold text-on-surface">{item.customers.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 min-w-[2px]"
                    style={{
                      width: `${(item.customers / maxCustomers) * 100}%`,
                      backgroundColor: item.bgColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const PlatformAnalytics = memo(PlatformAnalyticsInner)
