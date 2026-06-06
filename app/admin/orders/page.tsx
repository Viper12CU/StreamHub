"use client"

import { useState } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { OrderTabs } from "@/components/molecules/order-tabs"
import { OrderFilters } from "@/components/molecules/order-filters"
import { OrderTable } from "@/components/molecules/order-table"
import { OrderDetailDrawer } from "@/components/molecules/order-detail-drawer"
import { CreateOrderModal } from "@/components/molecules/create-order-modal"
import { PaymentVerificationCenter } from "@/components/molecules/payment-verification-center"
import { InventoryAssignmentQueue } from "@/components/molecules/inventory-assignment-queue"
import { DeliveryQueue } from "@/components/molecules/delivery-queue"
import { OrderAnalytics } from "@/components/molecules/order-analytics"
import { RecentOrderActivity } from "@/components/molecules/recent-order-activity"
import { OperationalAlerts } from "@/components/molecules/operational-alerts"

export default function OrdersPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Órdenes</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Rastrea, procesa, verifica y cumple las órdenes de clientes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Orden
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">upload</span>
            Exportar Órdenes
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">download</span>
            Descargar Reportes
          </button>
        </div>
      </section>

      {/* Search & Bulk Actions */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por número de orden, cliente, email, producto o referencia de pago..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedOrders.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                Aprobar Pagos
              </button>
              <button className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-semibold rounded-lg hover:bg-secondary/20 transition-colors">
                Asignar Inventario
              </button>
              <button className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors">
                Marcar Entregadas
              </button>
              <button className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors">
                Exportar
              </button>
              <button className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors">
                Cancelar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Total Órdenes"
          description="Todas las órdenes"
          value="1,248"
          accent="border-primary"
          icon="receipt_long"
          iconColor="text-primary"
        />
        <MetricCard
          label="Órdenes Hoy"
          description="42 Órdenes hoy"
          value="42"
          accent="border-secondary"
          badge="+12%"
          badgeColor="text-green-400"
          icon="today"
          iconColor="text-secondary"
        />
        <MetricCard
          label="Pendientes"
          description="18 Pendientes"
          value="18"
          accent="border-amber-500"
          badge="Pendiente"
          badgeColor="text-amber-500"
          icon="pending"
          iconColor="text-amber-500"
        />
        <MetricCard
          label="Esperando Verificación"
          description="7 Pagos"
          value="7"
          accent="border-orange-400"
          badge="Atención"
          badgeColor="text-orange-400"
          icon="gpp_maybe"
          iconColor="text-orange-400"
        />
        <MetricCard
          label="Entregadas"
          description="1,117 Entregadas"
          value="1,117"
          accent="border-green-500"
          badge="Éxito"
          badgeColor="text-green-400"
          icon="check_circle"
          iconColor="text-green-400"
        />
        <MetricCard
          label="Canceladas"
          description="24 Canceladas"
          value="24"
          accent="border-error"
          badge="Cancelada"
          badgeColor="text-error"
          icon="cancel"
          iconColor="text-error"
        />
      </section>

      {/* Tabs */}
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <OrderFilters onToggle={() => setShowFilters(!showFilters)} isOpen={showFilters} />

      {/* Main Orders Table */}
      <OrderTable
        selectedOrders={selectedOrders}
        onSelectOrders={setSelectedOrders}
        onViewOrder={setSelectedOrder}
        activeTab={activeTab}
      />

      {/* Operational Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PaymentVerificationCenter />
        <InventoryAssignmentQueue />
        <DeliveryQueue />
      </div>

      {/* Analytics */}
      <OrderAnalytics />

      {/* Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentOrderActivity />
        <OperationalAlerts />
      </div>

      {/* Modals & Drawers */}
      {showCreateModal && <CreateOrderModal onClose={() => setShowCreateModal(false)} />}
      {selectedOrder && (
        <OrderDetailDrawer orderId={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
