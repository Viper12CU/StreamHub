"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import { PlatformTabs } from "@/components/molecules/platform-tabs"
import { PlatformFilters } from "@/components/molecules/platform-filters"
import { PlatformGrid } from "@/components/molecules/platform-grid"
import { PlatformDetailDrawer } from "@/components/molecules/platform-detail-drawer"
import { CreatePlatformModal } from "@/components/molecules/create-platform-modal"
import { EditPlatformModal } from "@/components/molecules/edit-platform-modal"
import { PlatformAnalytics } from "@/components/molecules/platform-analytics"
import { TopProductsByPlatform } from "@/components/molecules/top-products-by-platform"
import { PlatformHealth } from "@/components/molecules/platform-health"
import { RecentPlatformActivity } from "@/components/molecules/recent-platform-activity"
import {
  getPlatforms,
  getHealthAlerts,
  getPlatformProducts,
  createPlatform,
  clearPlatformCache,
  type PlatformWithMetrics,
  type PlatformFilters as PlatformFiltersType,
  type HealthAlert,
  type CreatePlatformInput,
} from "@/lib/api/platforms"
import { sileo } from "sileo"

export default function PlatformsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<PlatformWithMetrics | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-platforms-view") as "grid" | "table") || "grid"
    }
    return "grid"
  })
  const [search, setSearch] = useState("")

  useEffect(() => {
    localStorage.setItem("admin-platforms-view", viewMode)
  }, [viewMode])

  const [platforms, setPlatforms] = useState<PlatformWithMetrics[]>([])
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [healthLoading, setHealthLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [totalProductCount, setTotalProductCount] = useState(0)

  const [filters, setFilters] = useState<PlatformFiltersType>({})
  const [sortBy, setSortBy] = useState("name")

  const filtersRef = useRef(filters)
  const activeTabRef = useRef(activeTab)
  const searchRef = useRef(search)

  useEffect(() => { filtersRef.current = filters }, [filters])
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])
  useEffect(() => { searchRef.current = search }, [search])

  const fetchPlatforms = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setFetchError(null)
      const tabFilter: PlatformFiltersType = { ...filtersRef.current }
      if (activeTabRef.current !== "all") {
        tabFilter.status = activeTabRef.current as "active" | "inactive" | "archived"
      }
      if (searchRef.current) {
        tabFilter.search = searchRef.current
      }
      const result = await getPlatforms(tabFilter, page)
      setPlatforms(result.data)
      setPagination(result.pagination)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setFetchError(msg)
      sileo.error({ title: "Error", description: "No se pudieron cargar las plataformas" })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHealth = useCallback(async () => {
    try {
      setHealthLoading(true)
      const data = await getHealthAlerts()
      setHealthAlerts(data)
    } catch {
      // Health alerts are non-critical, fail silently
    } finally {
      setHealthLoading(false)
    }
  }, [])

  const fetchProductCounts = useCallback(async (platformIds: string[]) => {
    try {
      const results = await Promise.all(
        platformIds.map(async (id) => {
          const products = await getPlatformProducts(id)
          return { id, count: products.length }
        })
      )
      const counts: Record<string, number> = {}
      let total = 0
      for (const r of results) {
        counts[r.id] = r.count
        total += r.count
      }
      setProductCounts(counts)
      setTotalProductCount(total)
    } catch {
      // Non-critical
    }
  }, [])

  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  useEffect(() => {
    if (platforms.length > 0) {
      fetchProductCounts(platforms.map((p) => p.id))
    }
  }, [platforms, fetchProductCounts])

  useEffect(() => {
    fetchPlatforms()
  }, [activeTab, filters, search, fetchPlatforms])

  const handleCreatePlatform = async (data: CreatePlatformInput) => {
    try {
      await createPlatform(data)
      sileo.success({ title: "Exito", description: "Plataforma creada correctamente" })
      setShowCreateModal(false)
      fetchPlatforms()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo crear la plataforma" })
      throw err
    }
  }

  const handlePlatformUpdate = useCallback(() => {
    clearPlatformCache()
    setEditingPlatform(null)
    fetchPlatforms()
  }, [fetchPlatforms])

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    const apiFilters: PlatformFiltersType = {}
    if (newFilters.status?.length) {
      apiFilters.status = newFilters.status[0] as PlatformFiltersType["status"]
    }
    if (newFilters.category?.length) {
      apiFilters.category = newFilters.category[0] as PlatformFiltersType["category"]
    }
    setFilters(apiFilters)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
  }, [])

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0 || search.length > 0
  }, [filters, search])

  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => {
      switch (sortBy) {
        case "Ingresos": return b.revenue_monthly - a.revenue_monthly
        case "Productos": return (productCounts[b.id] || 0) - (productCounts[a.id] || 0)
        case "Inventario": return b.inventory_available - a.inventory_available
        case "Mas Reciente": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "Nombre":
        default: return a.name.localeCompare(b.name)
      }
    })
  }, [platforms, sortBy])

  const counts = useMemo(() => ({
    all: platforms.length,
    active: platforms.filter((p) => p.status === "active").length,
    inactive: platforms.filter((p) => p.status === "inactive").length,
    archived: platforms.filter((p) => p.status === "archived").length,
  }), [platforms])

  const totalProducts = useMemo(() => {
    return platforms.reduce((sum, p) => sum + (productCounts[p.id] || 0), 0)
  }, [platforms, productCounts])
  const totalInventory = useMemo(() => platforms.reduce((sum, p) => sum + (p.inventory_available || 0), 0), [platforms])
  const totalRevenue = useMemo(() => platforms.reduce((sum, p) => sum + (p.revenue_monthly || 0), 0), [platforms])

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Plataformas</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestiona servicios de streaming, plataformas digitales, disponibilidad y rendimiento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Plataforma
          </button>
        </div>
      </section>

      {/* Search & View Toggle */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <label htmlFor="platform-search" className="sr-only">Buscar plataformas</label>
            <input
              id="platform-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar plataformas por nombre, categoria o estado..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50 ${
                viewMode === "grid" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50 ${
                viewMode === "table" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">table_rows</span>
              Tabla
            </button>
          </div>
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {loading ? (
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
              label="Total Plataformas"
              description="Todas las plataformas"
              value={String(platforms.length)}
              accent="border-primary"
              icon="smart_display"
              iconColor="text-primary"
            />
            <MetricCard
              label="Activas"
              description={`${counts.active} Activas`}
              value={String(counts.active)}
              accent="border-green-500"
              badge="Exito"
              badgeColor="text-green-400"
              icon="check_circle"
              iconColor="text-green-400"
            />
            <MetricCard
              label="Inactivas"
              description={`${counts.inactive} Inactivas`}
              value={String(counts.inactive)}
              accent="border-amber-500"
              badge="Pendiente"
              badgeColor="text-amber-500"
              icon="pause_circle"
              iconColor="text-amber-500"
            />
            <MetricCard
              label="Productos Conectados"
              description={`${totalProductCount} registrados`}
              value={String(totalProductCount)}
              accent="border-secondary"
              icon="shopping_cart"
              iconColor="text-secondary"
            />
            <MetricCard
              label="Activos de Inventario"
              description={`${totalInventory.toLocaleString()} Assets`}
              value={totalInventory.toLocaleString()}
              accent="border-tertiary"
              icon="inventory_2"
              iconColor="text-tertiary"
            />
            <MetricCard
              label="Ingresos Mensuales"
              description={`$${totalRevenue.toLocaleString()}`}
              value={`$${totalRevenue.toLocaleString()}`}
              accent="border-green-500"
              icon="trending_up"
              iconColor="text-green-400"
            />
          </>
        )}
      </section>

      {/* Error State */}
      {fetchError && !loading && (
        <div className="glass rounded-xl p-8 border border-error/20 text-center space-y-3">
          <span className="material-symbols-outlined text-3xl text-error/50 block">error</span>
          <p className="text-sm text-on-surface">{fetchError}</p>
          <button
            onClick={() => fetchPlatforms()}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabs */}
      <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} loading={loading} />

      {/* Filters */}
      <PlatformFilters
        onToggle={() => setShowFilters(!showFilters)}
        isOpen={showFilters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Grid / Table View */}
      <PlatformGrid
        activeTab={activeTab}
        onSelectPlatform={setSelectedPlatform}
        viewMode={viewMode}
        platforms={sortedPlatforms}
        loading={loading}
        hasActiveFilters={hasActiveFilters}
        productCounts={productCounts}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchPlatforms(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50 ${
                pagination.page === i + 1
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "glass text-on-surface-variant hover:bg-white/5 border border-white/5"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Analytics */}
      <PlatformAnalytics platforms={platforms} loading={loading} />

      {/* Top Products & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProductsByPlatform platforms={platforms} loading={loading} />
        <PlatformHealth alerts={healthAlerts} loading={healthLoading} />
      </div>

      {/* Activity — FUTURO: Requiere tabla de auditoria (audit_logs) */}
      <RecentPlatformActivity />

      {/* Modals & Drawers */}
      {showCreateModal && (
        <CreatePlatformModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePlatform}
        />
      )}
      {editingPlatform && (
        <EditPlatformModal
          platform={editingPlatform}
          onClose={() => setEditingPlatform(null)}
          onUpdate={handlePlatformUpdate}
        />
      )}
      {selectedPlatform && (
        <PlatformDetailDrawer platformId={selectedPlatform} onClose={() => setSelectedPlatform(null)} onEdit={setEditingPlatform} />
      )}
    </div>
  )
}
