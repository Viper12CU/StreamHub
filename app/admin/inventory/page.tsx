"use client"

import { useState, useMemo } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { MetricCard } from "@/components/atoms/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import { InventoryTabs } from "@/components/molecules/inventory-tabs"
import { InventoryFilters } from "@/components/molecules/inventory-filters"
import { InventoryTable } from "@/components/molecules/inventory-table"
import { AssetDetailDrawer } from "@/components/molecules/asset-detail-drawer"
import { CreateAssetModal } from "@/components/molecules/create-asset-modal"
import { InventoryHealth } from "@/components/molecules/inventory-health"
import { LowStockMonitoring } from "@/components/molecules/low-stock-monitoring"
import { RecentAuditActivity } from "@/components/molecules/recent-audit-activity"
import { InventoryAssignmentCenter } from "@/components/molecules/inventory-assignment-center"
import {
  bulkInventoryAction,
  type InventoryFilters as InventoryFiltersType,
} from "@/lib/api/inventory"
import {
  useSWRInventory,
  useSWRInventoryStats,
  useSWRInventoryHealth,
  useSWRLowStock,
  useSWRInventoryTabCount,
} from "@/lib/api/hooks/use-sw-inventory"
import { usePlatforms } from "@/hooks/use-platforms"
import { Icon } from "@/components/atoms/icon"
import { sileo } from "sileo"

export default function InventoryPage() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showAssignment, setShowAssignment] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search)

  const { platforms } = usePlatforms()

  const effectiveFilters: InventoryFiltersType = useMemo(() => {
    const filters: InventoryFiltersType = { page, limit: 15, sort: "recent" }
    if (activeTab !== "all") {
      const assetTypeMap: Record<string, string> = {
        accounts: "account",
        profiles: "profile",
        codes: "code",
        packages: "package",
      }
      filters.asset_type = assetTypeMap[activeTab] as any
    }
    if (debouncedSearch) filters.search = debouncedSearch
    return filters
  }, [activeTab, debouncedSearch, page])

  const { data: items, pagination, isLoading, mutate } = useSWRInventory(effectiveFilters)
  const { data: stats, isLoading: statsLoading, mutate: mutateStats } = useSWRInventoryStats()
  const { data: health, isLoading: healthLoading } = useSWRInventoryHealth()
  const { data: lowStock, isLoading: lowStockLoading } = useSWRLowStock()
  const { count: accountsCount } = useSWRInventoryTabCount("account")
  const { count: profilesCount } = useSWRInventoryTabCount("profile")
  const { count: codesCount } = useSWRInventoryTabCount("code")
  const { count: packagesCount } = useSWRInventoryTabCount("package")

  const handleBulkAction = async (action: "delete" | "status") => {
    if (selectedAssets.length === 0) return
    try {
      if (action === "delete") {
        await bulkInventoryAction({ ids: selectedAssets, action: "delete" })
        sileo.success({ title: "Eliminados", description: `${selectedAssets.length} activos eliminados` })
      } else {
        await bulkInventoryAction({ ids: selectedAssets, action: "status", status: "suspended" })
        sileo.success({ title: "Actualizados", description: `${selectedAssets.length} activos suspendidos` })
      }
      setSelectedAssets([])
      mutate()
      mutateStats()
    } catch {
      sileo.error({ title: "Error", description: "No se pudo completar la acción" })
    }
  }

  const handleImport = () => {
    sileo.success({ title: "Próximamente", description: "Importación en desarrollo" })
  }

  const handleExport = () => {
    sileo.success({ title: "Próximamente", description: "Exportación en desarrollo" })
  }

  const tabCounts: Record<string, number> = {
    all: stats?.total_assets ?? 0,
    accounts: accountsCount,
    profiles: profilesCount,
    codes: codesCount,
    packages: packagesCount,
  }

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
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Icon name="plus"/>
            Agregar Inventario
          </button>
          {/* <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5"
          >
            <Icon name="upload" className="text-sm" />
            Importar
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5"
          >
            <Icon name="download" className="text-sm" />
            Exportar
          </button> */}
        </div>
      </section>

      {/* Search & Bulk Actions */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Icon name="magnify" className="absolute left-3 top-5 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cuentas, perfiles, códigos de activación, emails, productos o clientes..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          {selectedAssets.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedAssets.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => handleBulkAction("status")}
                className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-lg hover:bg-amber-500/20 transition-colors"
              >
                Suspender
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statsLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass p-4 rounded-xl border-l-4 border-primary/30 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton variant="circle" className="h-4 w-4" />
                </div>
                <Skeleton className="h-7 w-16 rounded mt-1" />
                <Skeleton className="h-2.5 w-24 rounded mt-0.5" />
              </div>
            ))}
          </>
        ) : (
          <>
            <MetricCard
              label="Total Activos"
              description="Inventario completo"
              value={stats?.total_assets?.toLocaleString() ?? "0"}
              accent="border-primary"
              icon="package-variant-closed"
              iconColor="text-primary"
            />
            <MetricCard
              label="Disponibles"
              description={`${stats?.available ?? 0} Disponibles`}
              value={String(stats?.available ?? 0)}
              accent="border-green-500"
              badge="Disponible"
              badgeColor="text-green-400"
              icon="check-circle"
              iconColor="text-green-400"
            />
            <MetricCard
              label="Reservados"
              description={`${stats?.reserved ?? 0} Reservados`}
              value={String(stats?.reserved ?? 0)}
              accent="border-amber-500"
              badge="Reservado"
              badgeColor="text-amber-500"
              icon="timer-sand"
              iconColor="text-amber-500"
            />
            <MetricCard
              label="Asignados"
              description={`${stats?.assigned ?? 0} Asignados`}
              value={String(stats?.assigned ?? 0)}
              accent="border-secondary"
              badge="Asignado"
              badgeColor="text-secondary"
              icon="person"
              iconColor="text-secondary"
            />
            <MetricCard
              label="Expirados"
              description={`${stats?.expired ?? 0} Expirados`}
              value={String(stats?.expired ?? 0)}
              accent="border-error"
              badge="Expirado"
              badgeColor="text-error"
              icon="timer-off"
              iconColor="text-error"
            />
            <MetricCard
              label="Stock Bajo"
              description={`${stats?.low_stock_products ?? 0} Productos`}
              value={String(stats?.low_stock_products ?? 0)}
              accent="border-amber-500"
              badge="Alerta"
              badgeColor="text-amber-500"
              icon="warning"
              iconColor="text-amber-500"
            />
          </>
        )}
      </section>

      {/* Tabs */}
      <InventoryTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setPage(1); setSelectedAssets([]) }} counts={tabCounts} />

      {/* Filters */}
      <InventoryFilters
        onToggle={() => setShowFilters(!showFilters)}
        isOpen={showFilters}
        platforms={platforms}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className={showAssignment ? "lg:col-span-8" : "lg:col-span-12"}>
          <InventoryTable
            items={items}
            loading={isLoading}
            pagination={pagination ?? { page: 1, totalPages: 1, total: 0 }}
            selectedAssets={selectedAssets}
            onSelectAssets={setSelectedAssets}
            onViewAsset={setSelectedAsset}
            onPageChange={(p) => { setPage(p); setSelectedAssets([]) }}
          />
        </div>

        {showAssignment && (
          <div className="lg:col-span-4">
            <InventoryAssignmentCenter onClose={() => setShowAssignment(false)} />
          </div>
        )}
      </div>

      {/* Analytics */}
      <InventoryHealth health={health ?? null} loading={healthLoading} />

      {/* Low Stock & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LowStockMonitoring items={lowStock} loading={lowStockLoading} />
        <RecentAuditActivity category="inventory" limit={8} />
      </div>

      {/* Modals & Drawers */}
      {showCreateModal && (
        <CreateAssetModal onClose={() => setShowCreateModal(false)} onCreated={() => { mutate(); mutateStats() }} />
      )}
      {selectedAsset && (
        <AssetDetailDrawer assetId={selectedAsset} onClose={() => setSelectedAsset(null)} onRefresh={() => { mutate(); mutateStats() }} />
      )}
    </div>
  )
}
