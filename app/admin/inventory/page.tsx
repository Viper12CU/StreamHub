"use client"

import { useState } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { InventoryTabs } from "@/components/molecules/inventory-tabs"
import { InventoryFilters } from "@/components/molecules/inventory-filters"
import { InventoryTable } from "@/components/molecules/inventory-table"
import { AssetDetailDrawer } from "@/components/molecules/asset-detail-drawer"
import { CreateAssetModal } from "@/components/molecules/create-asset-modal"
import { InventoryHealth } from "@/components/molecules/inventory-health"
import { LowStockMonitoring } from "@/components/molecules/low-stock-monitoring"
import { RecentInventoryActivity } from "@/components/molecules/recent-inventory-activity"
import { InventoryAssignmentCenter } from "@/components/molecules/inventory-assignment-center"

export default function InventoryPage() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showAssignment, setShowAssignment] = useState(false)

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Inventario</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestiona activos digitales, disponibilidad de cuentas, niveles de stock, asignaciones y ciclo de vida del inventario.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Agregar Inventario
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">upload</span>
            Importar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar
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
              placeholder="Buscar cuentas, perfiles, códigos de activación, emails, productos o clientes..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          {selectedAssets.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedAssets.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary/20 transition-colors">
                Asignar
              </button>
              <button className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-lg hover:bg-amber-500/20 transition-colors">
                Cambiar Estado
              </button>
              <button className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors">
                Exportar
              </button>
              <button className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors">
                Eliminar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Total Activos"
          description="Inventario completo"
          value="1,245"
          accent="border-primary"
          icon="inventory_2"
          iconColor="text-primary"
        />
        <MetricCard
          label="Disponibles"
          description="842 Disponibles"
          value="842"
          accent="border-green-500"
          badge="Disponible"
          badgeColor="text-green-400"
          icon="check_circle"
          iconColor="text-green-400"
        />
        <MetricCard
          label="Reservados"
          description="76 Reservados"
          value="76"
          accent="border-amber-500"
          badge="Reservado"
          badgeColor="text-amber-500"
          icon="hourglass_top"
          iconColor="text-amber-500"
        />
        <MetricCard
          label="Asignados"
          description="289 Asignados"
          value="289"
          accent="border-secondary"
          badge="Asignado"
          badgeColor="text-secondary"
          icon="person"
          iconColor="text-secondary"
        />
        <MetricCard
          label="Expirados"
          description="38 Expirados"
          value="38"
          accent="border-error"
          badge="Expirado"
          badgeColor="text-error"
          icon="timer_off"
          iconColor="text-error"
        />
        <MetricCard
          label="Stock Bajo"
          description="12 Productos"
          value="12"
          accent="border-amber-500"
          badge="Alerta"
          badgeColor="text-amber-500"
          icon="warning"
          iconColor="text-amber-500"
        />
      </section>

      {/* Tabs */}
      <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <InventoryFilters onToggle={() => setShowFilters(!showFilters)} isOpen={showFilters} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inventory Table */}
        <div className={showAssignment ? "lg:col-span-8" : "lg:col-span-12"}>
          <InventoryTable
            selectedAssets={selectedAssets}
            onSelectAssets={setSelectedAssets}
            onViewAsset={setSelectedAsset}
            activeTab={activeTab}
          />
        </div>

        {/* Assignment Center */}
        {showAssignment && (
          <div className="lg:col-span-4">
            <InventoryAssignmentCenter onClose={() => setShowAssignment(false)} />
          </div>
        )}
      </div>

      {/* Analytics */}
      <InventoryHealth />

      {/* Low Stock & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LowStockMonitoring />
        <RecentInventoryActivity />
      </div>

      {/* Modals & Drawers */}
      {showCreateModal && <CreateAssetModal onClose={() => setShowCreateModal(false)} />}
      {selectedAsset && (
        <AssetDetailDrawer assetId={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  )
}
