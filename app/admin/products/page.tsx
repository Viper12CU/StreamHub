"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductFilters } from "@/components/molecules/product-filters"
import { ProductTable } from "@/components/molecules/product-table"
import { ProductDetailDrawer } from "@/components/molecules/product-detail-drawer"
import { CreateProductModal } from "@/components/molecules/create-product-modal"
import { EditProductModal } from "@/components/molecules/edit-product-modal"
import { InventoryInsights } from "@/components/molecules/inventory-insights"
import { TopPerformers } from "@/components/molecules/top-performers"
import { ProductAnalytics } from "@/components/molecules/product-analytics"
import {
  getProducts,
  getProductAnalytics,
  getProductHealth,
  createProduct,
  bulkAction,
  clearProductCache,
  type ProductWithDetails,
  type ProductFilters as ProductFiltersType,
  type ProductAnalytics as ProductAnalyticsType,
  type ProductHealth,
  type CreateProductInput,
} from "@/lib/api/products"
import { sileo } from "sileo"

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductWithDetails | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-products-view") as "grid" | "table") || "table"
    }
    return "table"
  })
  const [search, setSearch] = useState("")

  useEffect(() => {
    localStorage.setItem("admin-products-view", viewMode)
  }, [viewMode])

  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [analytics, setAnalytics] = useState<ProductAnalyticsType | null>(null)
  const [health, setHealth] = useState<ProductHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [healthLoading, setHealthLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [counts, setCounts] = useState({ active: 0, draft: 0, out_of_stock: 0 })

  const [filters, setFilters] = useState<ProductFiltersType>({})
  const [sortBy, setSortBy] = useState("created")

  const filtersRef = useRef(filters)
  const searchRef = useRef(search)
  const sortByRef = useRef(sortBy)

  useEffect(() => { filtersRef.current = filters }, [filters])
  useEffect(() => { searchRef.current = search }, [search])
  useEffect(() => { sortByRef.current = sortBy }, [sortBy])

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setFetchError(null)
      const combinedFilters: ProductFiltersType = { ...filtersRef.current }
      if (searchRef.current) {
        combinedFilters.search = searchRef.current
      }
      if (sortByRef.current) {
        combinedFilters.sort = sortByRef.current
      }
      const result = await getProducts(combinedFilters, page)
      setProducts(result.data)
      setPagination(result.pagination)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setFetchError(msg)
      sileo.error({ title: "Error", description: "No se pudieron cargar los productos" })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const data = await getProductAnalytics()
      setAnalytics(data)
    } catch {
      // Non-critical
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  const fetchHealth = useCallback(async () => {
    try {
      setHealthLoading(true)
      const data = await getProductHealth()
      setHealth(data)
    } catch {
      // Non-critical
    } finally {
      setHealthLoading(false)
    }
  }, [])

  const fetchCounts = useCallback(async () => {
    try {
      const [activeRes, draftRes, healthData] = await Promise.all([
        getProducts({ status: "active" }, 1, 1),
        getProducts({ status: "draft" }, 1, 1),
        getProductHealth(),
      ])
      setCounts({
        active: activeRes.pagination.total,
        draft: draftRes.pagination.total,
        out_of_stock: healthData.out_of_stock_products.length,
      })
    } catch {
      // Non-critical
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
    fetchHealth()
    fetchCounts()
  }, [fetchAnalytics, fetchHealth, fetchCounts])

  useEffect(() => {
    fetchProducts()
  }, [filters, search, sortBy, fetchProducts])

  const handleCreateProduct = useCallback(async (data: CreateProductInput) => {
    try {
      await createProduct(data)
      sileo.success({ title: "Exito", description: "Producto creado correctamente" })
      setShowCreateModal(false)
      clearProductCache()
      fetchProducts()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo crear el producto" })
      throw err
    }
  }, [fetchProducts, fetchCounts])

  const handleProductUpdate = useCallback(() => {
    setEditProduct(null)
    clearProductCache()
    fetchProducts()
    fetchCounts()
  }, [fetchProducts, fetchCounts])

  const handleBulkAction = useCallback(async (action: "activate" | "deactivate" | "archive" | "delete") => {
    if (selectedProducts.length === 0) return
    try {
      await bulkAction({ action, ids: selectedProducts })
      sileo.success({ title: "Exito", description: `Acción "${action}" ejecutada en ${selectedProducts.length} productos` })
      setSelectedProducts([])
      clearProductCache()
      fetchProducts()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo ejecutar la acción" })
    }
  }, [selectedProducts, fetchProducts, fetchCounts])

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    const apiFilters: ProductFiltersType = {}
    if (newFilters.platform_id?.length) apiFilters.platform_id = newFilters.platform_id[0]
    if (newFilters.product_type?.length) apiFilters.product_type = newFilters.product_type[0] as ProductFiltersType["product_type"]
    if (newFilters.status?.length) apiFilters.status = newFilters.status[0] as ProductFiltersType["status"]
    if (newFilters.inventory_status?.length) apiFilters.inventory_status = newFilters.inventory_status[0] as ProductFiltersType["inventory_status"]
    if (newFilters.price_min?.length) {
      const val = parseFloat(newFilters.price_min[0])
      if (!isNaN(val) && val >= 0) apiFilters.price_min = val
    }
    if (newFilters.price_max?.length) {
      const val = parseFloat(newFilters.price_max[0])
      if (!isNaN(val) && val >= 0) apiFilters.price_max = val
    }
    setFilters(apiFilters)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
  }, [])

  const totalRevenue = useMemo(() => products.reduce((sum, p) => sum + (p.total_revenue || 0), 0), [products])

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Productos</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Administra el catálogo de productos, precios, disponibilidad y rendimiento de ventas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Producto
          </button>
          {/* <button
            className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5 focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={() => sileo.success({ title: "Próximamente", description: "Exportación en desarrollo" })}
            aria-label="Exportar productos"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5 focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={() => sileo.success({ title: "Próximamente", description: "Importación en desarrollo" })}
            aria-label="Importar productos"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            Importar
          </button> */}
        </div>
      </section>

      {/* Search & Bulk Actions */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <label htmlFor="product-search" className="sr-only">Buscar productos</label>
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos por nombre, plataforma o descripción..."
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
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedProducts.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-green-400/50"
                aria-label={`Activar ${selectedProducts.length} productos seleccionados`}
              >
                Activar
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-lg hover:bg-amber-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/50"
                aria-label={`Desactivar ${selectedProducts.length} productos seleccionados`}
              >
                Desactivar
              </button>
              <button
                onClick={() => handleBulkAction("archive")}
                className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label={`Archivar ${selectedProducts.length} productos seleccionados`}
              >
                Archivar
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors focus-visible:ring-2 focus-visible:ring-error/50"
                aria-label={`Eliminar ${selectedProducts.length} productos seleccionados`}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
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
              label="Total Productos"
              description="Catálogo completo"
              value={String(pagination.total)}
              accent="border-primary"
              icon="inventory"
              iconColor="text-primary"
            />
            <MetricCard
              label="Activos"
              description={`${counts.active} Activos`}
              value={String(counts.active)}
              accent="border-green-500"
              badge="Activo"
              badgeColor="text-green-400"
              icon="check_circle"
              iconColor="text-green-400"
            />
            <MetricCard
              label="Borradores"
              description={`${counts.draft} Borradores`}
              value={String(counts.draft)}
              accent="border-on-surface-variant"
              badge="Borrador"
              badgeColor="text-on-surface-variant"
              icon="edit_note"
              iconColor="text-on-surface-variant"
            />
            <MetricCard
              label="Sin Stock"
              description="Requieren reposición"
              value={String(counts.out_of_stock)}
              accent="border-error"
              badge="Sin Stock"
              badgeColor="text-error"
              icon="warning"
              iconColor="text-error"
            />
            <MetricCard
              label="Ingresos (Página)"
              description="Suma de la página actual"
              value={`$${totalRevenue.toLocaleString()}`}
              accent="border-secondary"
              icon="attach_money"
              iconColor="text-secondary"
            />
          </>
        )}
      </section>

      {/* Filters */}
      <ProductFilters
        onToggle={() => setShowFilters(!showFilters)}
        isOpen={showFilters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* Products Table */}
        <div className="lg:col-span-8">
          <ProductTable
            products={products}
            loading={loading}
            pagination={pagination}
            selectedProducts={selectedProducts}
            onSelectProducts={setSelectedProducts}
            onViewProduct={setSelectedProduct}
            onPageChange={(page) => fetchProducts(page)}
            viewMode={viewMode}
          />
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-2 space-y-5">
          <InventoryInsights health={health} loading={healthLoading} />
          <TopPerformers topProducts={analytics?.top_products ?? null} loading={analyticsLoading} />
        </div>
      </div>

      {/* Analytics */}
      <ProductAnalytics analytics={analytics} loading={analyticsLoading} />

      {/* Modals & Drawers */}
      {showCreateModal && (
        <CreateProductModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateProduct} />
      )}
      {selectedProduct && (
        <ProductDetailDrawer
          productId={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={(product) => setEditProduct(product)}
        />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  )
}
