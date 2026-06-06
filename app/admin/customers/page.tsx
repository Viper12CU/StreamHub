"use client"

import { useState } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { CustomerTabs } from "@/components/molecules/customer-tabs"
import { CustomerFilters } from "@/components/molecules/customer-filters"
import { CustomerTable } from "@/components/molecules/customer-table"
import { CustomerDetailDrawer } from "@/components/molecules/customer-detail-drawer"
import { CreateCustomerModal } from "@/components/molecules/create-customer-modal"
import { CustomerAnalytics } from "@/components/molecules/customer-analytics"
import { RecentCustomerActivity } from "@/components/molecules/recent-customer-activity"
import { CustomerInsights } from "@/components/molecules/customer-insights"

export default function CustomersPage() {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Clientes</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestiona cuentas de clientes, historial de compras, suscripciones y actividad de soporte.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Cliente
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">upload</span>
            Exportar Clientes
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">download</span>
            Descargar Reporte
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
              placeholder="Buscar por nombre, email, teléfono, número de orden o ID de cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          {selectedCustomers.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedCustomers.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                Enviar Email
              </button>
              <button className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-lg hover:bg-amber-500/20 transition-colors">
                Marcar VIP
              </button>
              <button className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors">
                Activar
              </button>
              <button className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors">
                Exportar
              </button>
              <button className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors">
                Suspender
              </button>
            </div>
          )}
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Total Clientes"
          description="Todos los clientes"
          value="3,482"
          accent="border-primary"
          icon="group"
          iconColor="text-primary"
        />
        <MetricCard
          label="Nuevos este Mes"
          description="214 Nuevos"
          value="214"
          accent="border-secondary"
          badge="+18%"
          badgeColor="text-green-400"
          icon="person_add"
          iconColor="text-secondary"
        />
        <MetricCard
          label="Activos"
          description="2,965 Activos"
          value="2,965"
          accent="border-green-500"
          badge="Éxito"
          badgeColor="text-green-400"
          icon="check_circle"
          iconColor="text-green-400"
        />
        <MetricCard
          label="Órdenes Pendientes"
          description="42 Clientes"
          value="42"
          accent="border-amber-500"
          badge="Pendiente"
          badgeColor="text-amber-500"
          icon="pending"
          iconColor="text-amber-500"
        />
        <MetricCard
          label="Clientes VIP"
          description="118 VIP"
          value="118"
          accent="border-amber-500"
          badge="VIP"
          badgeColor="text-amber-500"
          icon="diamond"
          iconColor="text-amber-500"
        />
        <MetricCard
          label="Riesgo de Abandono"
          description="27 Clientes"
          value="27"
          accent="border-error"
          badge="Alerta"
          badgeColor="text-error"
          icon="warning"
          iconColor="text-error"
        />
      </section>

      {/* Tabs */}
      <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <CustomerFilters onToggle={() => setShowFilters(!showFilters)} isOpen={showFilters} />

      {/* Main Customers Table */}
      <CustomerTable
        selectedCustomers={selectedCustomers}
        onSelectCustomers={setSelectedCustomers}
        onViewCustomer={setSelectedCustomer}
        activeTab={activeTab}
      />

      {/* Insights */}
      <CustomerInsights />

      {/* Analytics */}
      <CustomerAnalytics />

      {/* Activity */}
      <RecentCustomerActivity />

      {/* Modals & Drawers */}
      {showCreateModal && <CreateCustomerModal onClose={() => setShowCreateModal(false)} />}
      {selectedCustomer && (
        <CustomerDetailDrawer customerId={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  )
}
