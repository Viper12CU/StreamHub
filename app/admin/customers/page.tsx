"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { MetricCard } from "@/components/atoms/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomerTabs } from "@/components/molecules/customer-tabs"
import { CustomerFilters } from "@/components/molecules/customer-filters"
import { CustomerTable } from "@/components/molecules/customer-table"
import { CustomerDetailDrawer } from "@/components/molecules/customer-detail-drawer"
import { CreateCustomerModal } from "@/components/molecules/create-customer-modal"
import { CustomerAnalytics } from "@/components/molecules/customer-analytics"
import { RecentAuditActivity } from "@/components/molecules/recent-audit-activity"
import { CustomerInsights } from "@/components/molecules/customer-insights"
import {
  createCustomer,
  type Customer,
  type CustomerFilters as CustomerFiltersType,
  type CustomerCounts,
  type CustomerStatus,
} from "@/lib/api/customers"
import { useSWRCustomers, useSWRCustomerStats, useSWRCustomerAnalytics, useSWRCustomerInsights } from "@/lib/api/hooks/use-sw-customer"
import { Icon } from "@/components/atoms/icon"
import { sileo } from "sileo"

const sortMap: Record<string, string> = {
  "Más Recientes": "recent",
  "Mayor Valor": "value",
  "Más Órdenes": "orders",
  "Reciente Activo": "last_active",
  "Nombre": "name",
}

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-customers-view") as "grid" | "table") || "grid"
    }
    return "grid"
  })
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<CustomerFiltersType>({})
  const [sortBy, setSortBy] = useState("Más Recientes")

  useEffect(() => {
    localStorage.setItem("admin-customers-view", viewMode)
  }, [viewMode])

  const effectiveFilters = useMemo<CustomerFiltersType>(() => {
    const f: CustomerFiltersType = { ...filters }
    if (activeTab !== "all") {
      f.status = activeTab as CustomerFiltersType["status"]
    }
    if (debouncedSearch) {
      f.search = debouncedSearch
    }
    f.sort = (sortMap[sortBy] || "recent") as CustomerFiltersType["sort"]
    return f
  }, [activeTab, filters, debouncedSearch, sortBy])

  const { data: customers, pagination, isLoading, mutate } = useSWRCustomers(effectiveFilters, page, 50)
  const { data: counts } = useSWRCustomerStats()
  const { data: analytics, isLoading: analyticsLoading } = useSWRCustomerAnalytics()
  const { data: insights, isLoading: insightsLoading } = useSWRCustomerInsights()

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    const apiFilters: CustomerFiltersType = {}
    if (newFilters.registration?.length) {
      apiFilters.registration_start = newFilters.registration[0]
      apiFilters.registration_end = newFilters.registration[1]
    }
    if (newFilters.lifetime_value?.length) {
      apiFilters.lifetime_value_min = Number(newFilters.lifetime_value[0])
      apiFilters.lifetime_value_max = Number(newFilters.lifetime_value[1])
    }
    if (newFilters.total_orders?.length) {
      apiFilters.total_orders_min = Number(newFilters.total_orders[0])
      apiFilters.total_orders_max = Number(newFilters.total_orders[1])
    }
    setFilters(apiFilters)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
    setPage(1)
  }, [])

  const hasActiveFilters = Object.keys(filters).length > 0 || search.length > 0

  const defaultCounts: CustomerCounts = { all: 0, active: 0, inactive: 0, vip: 0, pending: 0, suspended: 0 }
  const countsData = counts ?? defaultCounts

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Clientes</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestiona cuentas de clientes, historial de compras, suscripciones y actividad de soporte.
          </p>
        </div>
        
      </section>

      {/* Search & View Toggle */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Icon name="magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
            <label htmlFor="customer-search" className="sr-only">Buscar clientes</label>
            <input
              id="customer-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email, teléfono o ID de cliente..."
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
              <Icon name="view-grid" className="text-sm" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50 ${
                viewMode === "table" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon name="table" className="text-sm" />
              Tabla
            </button>
          </div>
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {isLoading ? (
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
              label="Total Clientes"
              description="Todos los clientes"
              value={countsData.all.toLocaleString()}
              accent="border-primary"
              icon="group"
              iconColor="text-primary"
            />
            <MetricCard
              label="Activos"
              description={`${countsData.active} Activos`}
              value={countsData.active.toLocaleString()}
              accent="border-green-500"
              badge="Éxito"
              badgeColor="text-green-400"
              icon="check-circle"
              iconColor="text-green-400"
            />
            <MetricCard
              label="Inactivos"
              description={`${countsData.inactive} Inactivos`}
              value={countsData.inactive.toLocaleString()}
              accent="border-amber-500"
              badge="Pendiente"
              badgeColor="text-amber-500"
              icon="account-off"
              iconColor="text-amber-500"
            />
            <MetricCard
              label="VIP"
              description={`${countsData.vip} VIP`}
              value={countsData.vip.toLocaleString()}
              accent="border-amber-500"
              badge="VIP"
              badgeColor="text-amber-500"
              icon="diamond"
              iconColor="text-amber-500"
            />
            <MetricCard
              label="En Riesgo"
              description="Activos sin compra 30d"
              value={countsData.pending.toLocaleString()}
              accent="border-orange-400"
              badge="Alerta"
              badgeColor="text-orange-400"
              icon="warning"
              iconColor="text-orange-400"
            />
            <MetricCard
              label="Suspendidos"
              description={`${countsData.suspended} Suspendidos`}
              value={countsData.suspended.toLocaleString()}
              accent="border-error"
              badge="Alerta"
              badgeColor="text-error"
              icon="block"
              iconColor="text-error"
            />
          </>
        )}
      </section>

      {/* Error State */}
      {pagination === undefined && !isLoading && (
        <div className="glass rounded-xl p-8 border border-error/20 text-center space-y-3">
          <Icon name="alert-circle" className="text-3xl text-error/50 block" />
          <p className="text-sm text-on-surface">No se pudieron cargar los clientes</p>
          <button
            onClick={() => mutate()}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabs */}
      <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} counts={countsData} loading={isLoading} />

      {/* Filters */}
      <CustomerFilters
        onToggle={() => setShowFilters(!showFilters)}
        isOpen={showFilters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Grid / Table View */}
      <CustomerTable
        activeTab={activeTab}
        onSelectCustomer={setSelectedCustomer}
        viewMode={viewMode}
        customers={customers}
        loading={isLoading}
        hasActiveFilters={hasActiveFilters}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Insights */}
      {/* <CustomerInsights insights={insights ?? []} loading={insightsLoading} /> */}

      {/* Analytics */}
      <CustomerAnalytics analytics={analytics ?? null} loading={analyticsLoading} />

      {/* Activity */}
      <RecentAuditActivity category="customer" limit={8} />

      {/* Modals & Drawers */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customerId={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onRefresh={() => {
            mutate()
          }}
        />
      )}
    </div>
  )
}
