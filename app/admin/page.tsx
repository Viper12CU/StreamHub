"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/components/atoms/icon"
import { MetricCard } from "@/components/atoms/metric-card"
import { RevenueChart } from "@/components/molecules/revenue-chart"
import { ActivityTable } from "@/components/molecules/activity-table"
import { AlertsPanel } from "@/components/molecules/alerts-panel"
import { VerifyQueue } from "@/components/molecules/verify-queue"
import { InventoryStatus } from "@/components/molecules/inventory-status"
import { PlatformMix } from "@/components/molecules/platform-mix"
import { ShortcutsPanel } from "@/components/molecules/shortcuts-panel"
import { TopProducts } from "@/components/molecules/top-products"
import { CustomerGrowth } from "@/components/molecules/customer-growth"
import { RecentActivityFeed } from "@/components/molecules/recent-activity-feed"
import { getInventoryStats, type InventoryStats } from "@/lib/api/inventory"
import { getCustomerStats, type CustomerCounts } from "@/lib/api/customers"

export default function AdminDashboardPage() {
  const [invStats, setInvStats] = useState<InventoryStats | null>(null)
  const [custStats, setCustStats] = useState<CustomerCounts | null>(null)

  useEffect(() => {
    getInventoryStats().then(setInvStats).catch(() => {})
    getCustomerStats().then(setCustStats).catch(() => {})
  }, [])

  const metrics = [
    // FUTURO: Requiere GET /dashboard/stats
    { label: "Ingresos", description: "Revenue del mes actual", value: "$—", accent: "border-primary", icon: "currency-usd", iconColor: "text-primary", badge: "FUTURO", badgeColor: "text-on-surface-variant" },
    { label: "Hoy", description: "Ingresos de hoy", value: "$—", accent: "border-secondary", icon: "calendar-today", iconColor: "text-secondary", badge: "FUTURO", badgeColor: "text-on-surface-variant" },
    // FUTURO: Requiere GET /orders/stats
    { label: "Pedidos", description: "Órdenes totales", value: "—", accent: "border-tertiary", icon: "cart", iconColor: "text-tertiary", badge: "FUTURO", badgeColor: "text-on-surface-variant" },
    { label: "Pendientes", description: "Requieren atención", value: "—", accent: "border-error", icon: "progress-clock", iconColor: "text-error", badge: "FUTURO", badgeColor: "text-error" },
    // Conectado a API
    { label: "Clientes Activos", description: "Últimos 30 días", value: custStats?.active != null ? String(custStats.active) : "—", accent: "border-secondary", icon: "account-group", iconColor: "text-secondary" },
    // Conectado a API
    { label: "Stock Disponible", description: "Cuentas + perfiles", value: invStats?.available != null ? String(invStats.available) : "—", accent: "border-on-surface-variant", icon: "package-variant-closed", iconColor: "text-on-surface-variant" },
  ]

  return (
    <>
      {/* Header */}
      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Bienvenido de nuevo, Admin</h1>
          <p className="text-base text-on-surface-variant mt-1">Monitora ventas, inventario, pagos y actividad de clientes en StreamHub.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-on-surface-variant">
            {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        {/* Key Metrics */}
        <div className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* FUTURO: RevenueChart — requiere GET /dashboard/revenue */}
        <RevenueChart />

        {/* Critical Alerts — conectado a APIs */}
        <AlertsPanel />

        {/* FUTURO: ActivityTable — requiere GET /orders */}
        <ActivityTable />

        {/* FUTURO: VerifyQueue — requiere GET /payments/pending */}
        <VerifyQueue />

        {/* Inventory Status — conectado a APIs */}
        <InventoryStatus />

        {/* Platform Mix — conectado a APIs */}
        <PlatformMix />

        {/* Shortcuts — estático (navegación) */}
        <ShortcutsPanel />

        {/* Top Products — conectado a API */}
        <TopProducts />

        {/* Customer Growth — conectado a API */}
        <CustomerGrowth />

        {/* FUTURO: RecentActivityFeed — requiere endpoint unificado */}
        <RecentActivityFeed />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Icon name="plus" className="text-2xl" />
      </button>
    </>
  )
}
