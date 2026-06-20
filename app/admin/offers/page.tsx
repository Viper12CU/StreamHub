"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { OfferTabs } from "@/components/molecules/offer-tabs"
import { OfferFilters } from "@/components/molecules/offer-filters"
import { OfferTable } from "@/components/molecules/offer-table"
import { OfferDetailDrawer } from "@/components/molecules/offer-detail-drawer"
import { CreateOfferModal } from "@/components/molecules/create-offer-modal"
import { OfferAnalytics } from "@/components/molecules/offer-analytics"
import { RecentOfferActivity } from "@/components/molecules/recent-offer-activity"
import {
  getOffers,
  getOfferById,
  createOffer,
  deactivateOffer,
  deleteOffer,
  updateOffer,
  clearOfferCache,
  type Offer,
  type OfferWithProducts,
  type OfferFilters as OfferFiltersType,
  type CreateOfferInput,
} from "@/lib/api/offers"
import { sileo } from "sileo"

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedOffers, setSelectedOffers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<OfferFiltersType>({})
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-offers-view") as "grid" | "table") || "table"
    }
    return "table"
  })

  useEffect(() => {
    localStorage.setItem("admin-offers-view", viewMode)
  }, [viewMode])

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      const combinedFilters: OfferFiltersType = { ...filters }
      if (search) combinedFilters.search = search
      if (activeTab !== "all") combinedFilters.status = activeTab as OfferFiltersType["status"]
      const data = await getOffers(combinedFilters)
      setOffers(data)
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudieron cargar las ofertas" })
    } finally {
      setLoading(false)
    }
  }, [filters, search, activeTab])

  const fetchCounts = useCallback(async () => {
    try {
      const [all, active, inactive, expired] = await Promise.all([
        getOffers(),
        getOffers({ status: "active" }),
        getOffers({ status: "inactive" }),
        getOffers({ status: "expired" }),
      ])
      setCounts({
        all: all.length,
        active: active.length,
        inactive: inactive.length,
        expired: expired.length,
      })
    } catch {
      sileo.info({ title: "Aviso", description: "No se pudieron cargar las estadísticas" })
    }
  }, [])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  const handleCreateOffer = useCallback(async (data: CreateOfferInput) => {
    try {
      await createOffer(data)
      sileo.success({ title: "Éxito", description: "Oferta creada correctamente" })
      setShowCreateModal(false)
      clearOfferCache()
      fetchOffers()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo crear la oferta" })
    }
  }, [fetchOffers, fetchCounts])

  const handleDeleteOffer = useCallback(async (id: string) => {
    try {
      await deleteOffer(id)
      sileo.success({ title: "Éxito", description: "Oferta eliminada correctamente" })
      clearOfferCache()
      fetchOffers()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo eliminar la oferta" })
    }
  }, [fetchOffers, fetchCounts])

  const handleDeactivateOffer = useCallback(async (id: string) => {
    try {
      await deactivateOffer(id)
      sileo.success({ title: "Éxito", description: "Oferta desactivada" })
      clearOfferCache()
      fetchOffers()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo desactivar la oferta" })
    }
  }, [fetchOffers, fetchCounts])

  const handleStatusChange = useCallback(async (id: string, status: "active" | "inactive") => {
    try {
      if (status === "inactive") {
        await deactivateOffer(id)
      } else {
        await updateOffer(id, {})
      }
      sileo.success({ title: "Éxito", description: status === "active" ? "Oferta activada" : "Oferta desactivada" })
      clearOfferCache()
      fetchOffers()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo actualizar la oferta" })
    }
  }, [fetchOffers, fetchCounts])

  const handleDuplicateOffer = useCallback(async (id: string) => {
    try {
      const offer = await getOfferById(id)
      const duplicateData: CreateOfferInput = {
        title: `${offer.title} (Copia)`,
        description: offer.description || undefined,
        type: offer.type,
        discount_percent: offer.discount_percent || undefined,
        discount_amount_usd: offer.discount_amount_usd || undefined,
        combo_price_usd: offer.combo_price_usd || undefined,
        combo_price_cup: offer.combo_price_cup || undefined,
        start_date: offer.start_date || undefined,
        end_date: offer.end_date || undefined,
        product_ids: offer.products?.map((p) => p.product_id),
      }
      await createOffer(duplicateData)
      sileo.success({ title: "Éxito", description: "Oferta duplicada correctamente" })
      clearOfferCache()
      fetchOffers()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo duplicar la oferta" })
    }
  }, [fetchOffers, fetchCounts])

  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    const apiFilters: OfferFiltersType = {}
    if (newFilters.type?.length) apiFilters.type = newFilters.type[0] as OfferFiltersType["type"]
    setFilters(apiFilters)
  }, [])

  const handleBulkAction = useCallback(async (action: "activate" | "deactivate" | "delete") => {
    if (selectedOffers.length === 0) return
    try {
      for (const id of selectedOffers) {
        if (action === "activate") {
          await updateOffer(id, {})
        } else if (action === "deactivate") {
          await deactivateOffer(id)
        } else if (action === "delete") {
          await deleteOffer(id)
        }
      }
      sileo.success({ title: "Éxito", description: `Acción "${action}" ejecutada en ${selectedOffers.length} ofertas` })
      setSelectedOffers([])
      clearOfferCache()
      fetchOffers()
      fetchCounts()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo ejecutar la acción" })
    }
  }, [selectedOffers, fetchOffers, fetchCounts])

  const totalRevenue = useMemo(() => offers.reduce((sum, o) => sum + (o.combo_price_usd || o.discount_amount_usd || 0), 0), [offers])
  const expiringSoon = useMemo(() => {
    return offers.filter((o) => {
      if (o.status !== "active" || !o.end_date) return false
      const days = Math.ceil((new Date(o.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 7 && days > 0
    }).length
  }, [offers])

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Ofertas</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Crea, programa, gestiona y monitorea promociones en productos y plataformas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Icon name="plus" className="text-sm" />
            Crear Oferta
          </button>
        </div>
      </section>

      {/* Search & Bulk Actions */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Icon name="magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
            <label htmlFor="offer-search" className="sr-only">Buscar ofertas</label>
            <input
              id="offer-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ofertas por nombre o descripción..."
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
          {selectedOffers.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedOffers.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-green-400/50"
              >
                Activar
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-lg hover:bg-amber-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                Desactivar
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors focus-visible:ring-2 focus-visible:ring-error/50"
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
              label="Total Ofertas"
              description="Catálogo completo"
              value={String(counts.all || 0)}
              accent="border-primary"
              icon="tag"
              iconColor="text-primary"
            />
            <MetricCard
              label="Activas"
              description={`${counts.active || 0} Activas`}
              value={String(counts.active || 0)}
              accent="border-green-500"
              badge="Activa"
              badgeColor="text-green-400"
              icon="check-circle"
              iconColor="text-green-400"
            />
            <MetricCard
              label="Inactivas"
              description={`${counts.inactive || 0} Inactivas`}
              value={String(counts.inactive || 0)}
              accent="border-amber-500"
              badge="Inactiva"
              badgeColor="text-amber-500"
              icon="pause-circle"
              iconColor="text-amber-500"
            />
            <MetricCard
              label="Expiradas"
              description={`${counts.expired || 0} Expiradas`}
              value={String(counts.expired || 0)}
              accent="border-error"
              badge="Expirada"
              badgeColor="text-error"
              icon="clock-alert"
              iconColor="text-error"
            />
            <MetricCard
              label="Por Expirar"
              description="Requieren atención"
              value={String(expiringSoon)}
              accent="border-secondary"
              badge="Atención"
              badgeColor="text-secondary"
              icon="alert"
              iconColor="text-secondary"
            />
          </>
        )}
      </section>

      {/* Tabs */}
      <OfferTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      {/* Filters */}
      <OfferFilters
        onToggle={() => setShowFilters(!showFilters)}
        isOpen={showFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* Offers Table */}
        <div className="lg:col-span-8">
          <OfferTable
            offers={offers}
            loading={loading}
            selectedOffers={selectedOffers}
            onSelectOffers={setSelectedOffers}
            onRowClick={setSelectedOffer}
            viewMode={viewMode}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-5 h-full">
          {/* Campaign Health */}
          <div className="glass p-5 rounded-xl border border-white/5">
            <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
              <Icon name="heart-pulse" className="text-sm text-primary" />
              Salud de Campañas
            </h3>
            <div className="space-y-3">
              {(counts.inactive || 0) > 0 && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Icon name="pause" className="text-xs text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-on-surface">Ofertas inactivas</p>
                    <p className="text-[10px] text-on-surface-variant">{counts.inactive} ofertas desactivadas</p>
                  </div>
                </div>
              )}
              {expiringSoon > 0 && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Icon name="clock-alert" className="text-xs text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-on-surface">Por expirar pronto</p>
                    <p className="text-[10px] text-on-surface-variant">{expiringSoon} ofertas vencen en 7 días</p>
                  </div>
                </div>
              )}
              {(counts.expired || 0) > 0 && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                    <Icon name="clock-alert" className="text-xs text-error" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-on-surface">Ofertas expiradas</p>
                    <p className="text-[10px] text-on-surface-variant">{counts.expired} ofertas vencidas</p>
                  </div>
                </div>
              )}
              {(!counts.inactive && !expiringSoon && !counts.expired) || (counts.inactive === 0 && expiringSoon === 0 && counts.expired === 0) ? (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-400/10 flex items-center justify-center shrink-0">
                    <Icon name="check-circle" className="text-xs text-green-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-on-surface">Todo en orden</p>
                    <p className="text-[10px] text-on-surface-variant">No hay alertas activas</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          
        </div>
      </div>

      {/* Analytics */}
      <OfferAnalytics offers={offers} loading={loading} />

      {/* Recent Activity */}
      <RecentOfferActivity />

      {/* Modals & Drawers */}
      {showCreateModal && (
        <CreateOfferModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateOffer} />
      )}
      {selectedOffer && (
        <OfferDetailDrawer
          offerId={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onRefresh={() => { fetchOffers(); fetchCounts() }}
        />
      )}
    </div>
  )
}
