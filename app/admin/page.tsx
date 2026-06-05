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

const metrics = [
  { label: "Ingresos", description: "Revenue del mes actual", value: "$12,450", accent: "border-primary", badge: "+18%", badgeColor: "text-primary", icon: "attach_money", iconColor: "text-primary" },
  { label: "Hoy", description: "+7.2% vs ayer", value: "$540", accent: "border-secondary", badge: "+7.2%", badgeColor: "text-primary", icon: "today", iconColor: "text-secondary" },
  { label: "Pedidos", description: "328 órdenes totales", value: "328", accent: "border-tertiary", icon: "shopping_cart", iconColor: "text-tertiary" },
  { label: "Pendientes", description: "Requieren atención", value: "24", accent: "border-error", badge: "Atención", badgeColor: "text-error", icon: "pending_actions", iconColor: "text-error" },
  { label: "Clientes Activos", description: "Últimos 30 días", value: "1.2k", accent: "border-secondary", icon: "group", iconColor: "text-secondary" },
  { label: "Stock Disponible", description: "Cuentas + perfiles", value: "842", accent: "border-on-surface-variant", icon: "inventory_2", iconColor: "text-on-surface-variant" },
]

export default function AdminDashboardPage() {
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

        {/* Revenue Chart */}
        <RevenueChart />

        {/* Critical Alerts */}
        <AlertsPanel />

        {/* Recent Orders */}
        <ActivityTable />

        {/* Verify Queue */}
        <VerifyQueue />

        {/* Inventory Status */}
        <InventoryStatus />

        {/* Platform Mix */}
        <PlatformMix />

        {/* Shortcuts */}
        <ShortcutsPanel />

        {/* Top Products */}
        <TopProducts />

        {/* Customer Growth */}
        <CustomerGrowth />

        {/* Recent Activity Feed */}
        <RecentActivityFeed />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </>
  )
}
