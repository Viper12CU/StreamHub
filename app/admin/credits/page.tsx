"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Icon } from "@/components/atoms/icon"
import { sileo } from "sileo"
import { CreditStatsCards } from "@/components/molecules/credit-stats-cards"
import { CreditAccountTabs } from "@/components/molecules/credit-account-tabs"
import { CreditAccountFilters } from "@/components/molecules/credit-account-filters"
import { CreditAccountTable } from "@/components/molecules/credit-account-table"
import { CreditAccountDetailDrawer } from "@/components/molecules/credit-account-detail-drawer"
import { CreditTransactionTable } from "@/components/molecules/credit-transaction-table"
import { CreditAnalytics } from "@/components/molecules/credit-analytics"
import { GrantCreditsModal } from "@/components/molecules/grant-credits-modal"
import { DeductCreditsModal } from "@/components/molecules/deduct-credits-modal"
import { AdjustCreditsModal } from "@/components/molecules/adjust-credits-modal"
import {
  getCreditAccounts,
  getCreditStats,
  getCreditAnalytics,
  type CreditAccountWithUser,
  type CreditAccountFilters as CreditAccountFiltersType,
  type CreditStats,
  type CreditAnalyticsData,
  type CreditCounts,
} from "@/lib/api/credits"

const sortMap: Record<string, string> = {
  "Más Recientes": "recent",
  "Mayor Balance": "balance_high",
  "Menor Balance": "balance_low",
  "Mayor Gasto": "spent",
  "Nombre": "name",
}

export default function CreditsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-credits-view") as "grid" | "table") || "table"
    }
    return "table"
  })
  const [search, setSearch] = useState("")

  useEffect(() => {
    localStorage.setItem("admin-credits-view", viewMode)
  }, [viewMode])

  const [accounts, setAccounts] = useState<CreditAccountWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [counts, setCounts] = useState<CreditCounts>({ all: 0, with_balance: 0, no_balance: 0 })

  const [stats, setStats] = useState<CreditStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<CreditAnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  const [filters, setFilters] = useState<CreditAccountFiltersType>({})
  const [sortBy, setSortBy] = useState("Más Recientes")

  const [showGrantModal, setShowGrantModal] = useState(false)
  const [showDeductModal, setShowDeductModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [modalCustomerId, setModalCustomerId] = useState<string>("")
  const [modalUserName, setModalUserName] = useState<string>("")
  const [refreshKey, setRefreshKey] = useState(0)

  const filtersRef = useRef(filters)
  const activeTabRef = useRef(activeTab)
  const searchRef = useRef(search)

  useEffect(() => { filtersRef.current = filters }, [filters])
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])
  useEffect(() => { searchRef.current = search }, [search])

  const fetchAccounts = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setFetchError(null)
      const tabFilters: CreditAccountFiltersType = { ...filtersRef.current }
      if (activeTabRef.current === "with_balance") {
        tabFilters.has_balance = true
      } else if (activeTabRef.current === "no_balance") {
        tabFilters.has_balance = false
      }
      if (searchRef.current) {
        tabFilters.search = searchRef.current
      }
      tabFilters.sort = (sortMap[sortBy] || "recent") as CreditAccountFiltersType["sort"]
      const result = await getCreditAccounts(tabFilters, page)
      setAccounts(result.data)
      setPagination(result.pagination)
      setCounts({
        all: result.pagination.total,
        with_balance: result.data.filter(a => a.balance > 0).length,
        no_balance: result.data.filter(a => a.balance === 0).length,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setFetchError(msg)
      sileo.error({ title: "Error", description: "No se pudieron cargar las cuentas de crédito" })
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const data = await getCreditStats()
      setStats(data)
    } catch {
      // Non-critical
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const data = await getCreditAnalytics()
      setAnalytics(data)
    } catch {
      // Non-critical
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchAnalytics()
  }, [fetchStats, fetchAnalytics])

  useEffect(() => {
    fetchAccounts()
  }, [activeTab, filters, search, fetchAccounts])

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    const apiFilters: CreditAccountFiltersType = {}
    if (newFilters.balance?.length) {
      apiFilters.balance_min = Number(newFilters.balance[0])
      apiFilters.balance_max = Number(newFilters.balance[1])
    }
    setFilters(apiFilters)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
  }, [])

  const handleRefresh = useCallback(() => {
    fetchAccounts()
    fetchStats()
    fetchAnalytics()
    setRefreshKey(k => k + 1)
  }, [fetchAccounts, fetchStats, fetchAnalytics])

  const openGrantModal = useCallback((customerId: string, userName?: string) => {
    setModalCustomerId(customerId)
    setModalUserName(userName || "")
    setShowGrantModal(true)
  }, [])

  const openDeductModal = useCallback((customerId: string, userName?: string) => {
    setModalCustomerId(customerId)
    setModalUserName(userName || "")
    setShowDeductModal(true)
  }, [])

  const openAdjustModal = useCallback((customerId: string, userName?: string) => {
    setModalCustomerId(customerId)
    setModalUserName(userName || "")
    setShowAdjustModal(true)
  }, [])

  useEffect(() => {
    const handleGrantEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      openGrantModal(detail.customerId, detail.userName)
    }
    const handleDeductEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      openDeductModal(detail.customerId, detail.userName)
    }
    const handleAdjustEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      openAdjustModal(detail.customerId, detail.userName)
    }

    window.addEventListener("credit:grant", handleGrantEvent)
    window.addEventListener("credit:deduct", handleDeductEvent)
    window.addEventListener("credit:adjust", handleAdjustEvent)
    return () => {
      window.removeEventListener("credit:grant", handleGrantEvent)
      window.removeEventListener("credit:deduct", handleDeductEvent)
      window.removeEventListener("credit:adjust", handleAdjustEvent)
    }
  }, [openGrantModal, openDeductModal, openAdjustModal])

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0 || search.length > 0
  }, [filters, search])

  return (
    <div className="space-y-4">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Créditos</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestiona cuentas de crédito, otorga, deduce o ajusta saldos de usuarios.
          </p>
        </div>
      </section>

      {/* Search & View Toggle */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Icon name="magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
            <label htmlFor="credit-search" className="sr-only">Buscar cuentas de crédito</label>
            <input
              id="credit-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email del usuario..."
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
      <CreditStatsCards stats={stats} loading={statsLoading} />

      {/* Error State */}
      {fetchError && !loading && (
        <div className="glass rounded-xl p-8 border border-error/20 text-center space-y-3">
          <Icon name="alert-circle" className="text-3xl text-error/50 block" />
          <p className="text-sm text-on-surface">{fetchError}</p>
          <button
            onClick={() => fetchAccounts()}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabs */}
      <CreditAccountTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} loading={loading} />

      {/* Filters */}
      <CreditAccountFilters
        onToggle={() => setShowFilters(!showFilters)}
        isOpen={showFilters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Grid / Table View + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        <div className="lg:col-span-8">
          <CreditAccountTable
            onSelectAccount={setSelectedCustomer}
            viewMode={viewMode}
            accounts={accounts}
            loading={loading}
            hasActiveFilters={hasActiveFilters}
            pagination={pagination}
            onPageChange={(page) => fetchAccounts(page)}
          />
        </div>
        <div className="lg:col-span-2 space-y-5">
          <CreditAnalytics analytics={analytics} loading={analyticsLoading} />
        </div>
      </div>

      {/* Transaction History */}
      <CreditTransactionTable refreshKey={refreshKey} />

      {/* Modals & Drawers */}
      {selectedCustomer && (
        <CreditAccountDetailDrawer
          customerId={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onRefresh={handleRefresh}
        />
      )}
      {showGrantModal && (
        <GrantCreditsModal
          customerId={modalCustomerId}
          userName={modalUserName}
          onClose={() => setShowGrantModal(false)}
          onCreated={() => {
            setShowGrantModal(false)
            sileo.success({ title: "Éxito", description: "Créditos otorgados correctamente" })
            handleRefresh()
          }}
        />
      )}
      {showDeductModal && (
        <DeductCreditsModal
          customerId={modalCustomerId}
          userName={modalUserName}
          onClose={() => setShowDeductModal(false)}
          onCreated={() => {
            setShowDeductModal(false)
            sileo.success({ title: "Éxito", description: "Créditos deducidos correctamente" })
            handleRefresh()
          }}
        />
      )}
      {showAdjustModal && (
        <AdjustCreditsModal
          customerId={modalCustomerId}
          userName={modalUserName}
          onClose={() => setShowAdjustModal(false)}
          onCreated={() => {
            setShowAdjustModal(false)
            sileo.success({ title: "Éxito", description: "Balance ajustado correctamente" })
            handleRefresh()
          }}
        />
      )}
    </div>
  )
}
