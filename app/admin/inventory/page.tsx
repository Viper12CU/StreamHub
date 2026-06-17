"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import { InventoryTabs } from "@/components/molecules/inventory-tabs"
import { InventoryFilters } from "@/components/molecules/inventory-filters"
import { InventoryTable } from "@/components/molecules/inventory-table"
import { AssetDetailDrawer } from "@/components/molecules/asset-detail-drawer"
import { CreateAssetModal } from "@/components/molecules/create-asset-modal"
import { InventoryHealth } from "@/components/molecules/inventory-health"
import { LowStockMonitoring } from "@/components/molecules/low-stock-monitoring"
import { RecentInventoryActivity } from "@/components/molecules/recent-inventory-activity"
import { InventoryAssignmentCenter } from "@/components/molecules/inventory-assignment-center"
import {
  getInventory,
  getInventoryStats,
  getInventoryHealth,
  getLowStock,
  getInventoryActivity,
  bulkInventoryAction,
  clearInventoryCache,
  type InventoryWithDetails,
  type InventoryStats,
  type InventoryHealth as InventoryHealthType,
  type LowStockItem,
  type InventoryActivity,
  type InventoryFilters as InventoryFiltersType,
} from "@/lib/api/inventory"
import { getPlatforms, type Platform } from "@/lib/api/platforms"
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

  const [items, setItems] = useState<InventoryWithDetails[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [health, setHealth] = useState<InventoryHealthType | null>(null)
  const [lowStock, setLowStock] = useState<LowStockItem[]>([])
  const [activities, setActivities] = useState<InventoryActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [healthLoading, setHealthLoading] = useState(true)
  const [lowStockLoading, setLowStockLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [tabTypeCounts, setTabTypeCounts] = useState({ accounts: 0, profiles: 0, codes: 0, packages: 0 })

  const { platforms } = usePlatforms()

  const activeTabRef = useRef(activeTab)
  const searchRef = useRef(search)

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const filters: InventoryFiltersType = {
        page,
        limit: 15,
        sort: "recent",
      }
      if (activeTabRef.current !== "all") {
        const assetTypeMap: Record<string, string> = {
          accounts: "account",
          profiles: "profile",
          codes: "code",
          packages: "package",
        }
        filters.asset_type = assetTypeMap[activeTabRef.current] as any
      }
      if (searchRef.current) filters.search = searchRef.current

      const result = await getInventory(filters)
      setItems(result.data)
      setPagination(result.pagination)
    } catch {
      sileo.error({ title: "Error", description: "No se pudo cargar el inventario" })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const data = await getInventoryStats()
      setStats(data)
    } catch {
      // silent
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true)
    try {
      const data = await getInventoryHealth()
      setHealth(data)
    } catch {
      // silent
    } finally {
      setHealthLoading(false)
    }
  }, [])

  const fetchLowStock = useCallback(async () => {
    setLowStockLoading(true)
    try {
      const data = await getLowStock()
      setLowStock(data)
    } catch {
      // silent
    } finally {
      setLowStockLoading(false)
    }
  }, [])

  const fetchActivity = useCallback(async () => {
    setActivityLoading(true)
    try {
      const data = await getInventoryActivity(10)
      setActivities(data)
    } catch {
      // silent
    } finally {
      setActivityLoading(false)
    }
  }, [])

  const fetchTabTypeCounts = useCallback(async () => {
    try {
      const [accounts, profiles, codes, packages] = await Promise.all([
        getInventory({ asset_type: "account", limit: 1 }),
        getInventory({ asset_type: "profile", limit: 1 }),
        getInventory({ asset_type: "code", limit: 1 }),
        getInventory({ asset_type: "package", limit: 1 }),
      ])
      setTabTypeCounts({
        accounts: accounts.pagination.total,
        profiles: profiles.pagination.total,
        codes: codes.pagination.total,
        packages: packages.pagination.total,
      })
    } catch {
      // silent
    }
  }, [])

  const fetchAll = useCallback(() => {
    fetchItems(1)
    fetchStats()
    fetchHealth()
    fetchLowStock()
    fetchActivity()
    fetchTabTypeCounts()
  }, [fetchItems, fetchStats, fetchHealth, fetchLowStock, fetchActivity, fetchTabTypeCounts])

  useEffect(() => { fetchAll() }, [fetchAll])

  useEffect(() => {
    activeTabRef.current = activeTab
    fetchItems(1)
    setSelectedAssets([])
  }, [activeTab, fetchItems])

  useEffect(() => {
    searchRef.current = search
  }, [search])

  const handleSearch = () => {
    fetchItems(1)
    setSelectedAssets([])
  }

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
      clearInventoryCache()
      setSelectedAssets([])
      fetchAll()
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
    accounts: tabTypeCounts.accounts,
    profiles: tabTypeCounts.profiles,
    codes: tabTypeCounts.codes,
    packages: tabTypeCounts.packages,
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
            <Icon name="plus" className="text-sm" />
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
            <Icon name="magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
      <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

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
            loading={loading}
            pagination={pagination}
            selectedAssets={selectedAssets}
            onSelectAssets={setSelectedAssets}
            onViewAsset={setSelectedAsset}
            onPageChange={(page) => fetchItems(page)}
          />
        </div>

        {showAssignment && (
          <div className="lg:col-span-4">
            <InventoryAssignmentCenter onClose={() => setShowAssignment(false)} />
          </div>
        )}
      </div>

      {/* Analytics */}
      <InventoryHealth health={health} loading={healthLoading} />

      {/* Low Stock & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LowStockMonitoring items={lowStock} loading={lowStockLoading} />
        <RecentInventoryActivity activities={activities} loading={activityLoading} />
      </div>

      {/* Modals & Drawers */}
      {showCreateModal && (
        <CreateAssetModal onClose={() => setShowCreateModal(false)} onCreated={fetchAll} />
      )}
      {selectedAsset && (
        <AssetDetailDrawer assetId={selectedAsset} onClose={() => setSelectedAsset(null)} onRefresh={fetchAll} />
      )}
    </div>
  )
}
