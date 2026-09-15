"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { getAudits, type Audit, type AuditCategory, type AuditStatus } from "@/lib/api/audits"
import { formatRelativeDate } from "@/lib/constants/shared"

const allCategories: { value: AuditCategory | "all"; label: string; icon: string }[] = [
  { value: "all", label: "Todas", icon: "text-box-check" },
  { value: "platform", label: "Plataformas", icon: "monitor-shimmer" },
  { value: "product", label: "Productos", icon: "package-variant" },
  { value: "inventory", label: "Inventario", icon: "cube-send" },
  { value: "order", label: "Órdenes", icon: "cart" },
  { value: "customer", label: "Clientes", icon: "account" },
  { value: "offer", label: "Ofertas", icon: "tag" },
  { value: "credit", label: "Créditos", icon: "currency-usd" },
  { value: "user", label: "Usuarios", icon: "account-circle" },
  { value: "wishlist", label: "Deseos", icon: "heart" },
  { value: "system", label: "Sistema", icon: "cog" },
]

const categoryColor: Record<AuditCategory, { icon: string; color: string; bg: string }> = {
  platform: { icon: "monitor-shimmer", color: "text-primary", bg: "bg-primary/20" },
  product: { icon: "package-variant", color: "text-secondary", bg: "bg-secondary/20" },
  inventory: { icon: "cube-send", color: "text-tertiary", bg: "bg-tertiary/20" },
  order: { icon: "cart", color: "text-green-400", bg: "bg-green-400/20" },
  customer: { icon: "account", color: "text-purple-400", bg: "bg-purple-400/20" },
  credit: { icon: "currency-usd", color: "text-amber-500", bg: "bg-amber-500/20" },
  user: { icon: "account-circle", color: "text-blue-400", bg: "bg-blue-400/20" },
  offer: { icon: "tag", color: "text-pink-400", bg: "bg-pink-400/20" },
  wishlist: { icon: "heart", color: "text-red-400", bg: "bg-red-400/20" },
  system: { icon: "cog", color: "text-on-surface-variant", bg: "bg-surface-container-high" },
}

const statusStyles: Record<AuditStatus, { label: string; color: string; bg: string; border: string }> = {
  info: { label: "Info", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  warning: { label: "Alerta", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  error: { label: "Error", color: "text-error", bg: "bg-error/10", border: "border-error/30" },
}

function formatTimestamp(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Ahora"
    if (mins < 60) return `Hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `Hace ${days}d`
    return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return dateStr
  }
}

function AuditPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCategory = (searchParams.get("category") as AuditCategory | null) || null

  const [activeCategory, setActiveCategory] = useState<AuditCategory | "all">(initialCategory || "all")
  const [activeStatus, setActiveStatus] = useState<AuditStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  const updateURL = useCallback((cat: AuditCategory | "all") => {
    const params = new URLSearchParams()
    if (cat !== "all") params.set("category", cat)
    const qs = params.toString()
    router.replace(`/admin/audit${qs ? `?${qs}` : ""}`, { scroll: false })
  }, [router])

  const handleCategoryChange = useCallback((cat: AuditCategory | "all") => {
    setActiveCategory(cat)
    setPagination((p) => ({ ...p, page: 1 }))
    updateURL(cat)
  }, [updateURL])

  const handleStatusChange = useCallback((status: AuditStatus | "all") => {
    setActiveStatus(status)
    setPagination((p) => ({ ...p, page: 1 }))
  }, [])

  const fetchAudits = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const filters: Record<string, string> = {}
      if (activeCategory !== "all") filters.category = activeCategory
      if (activeStatus !== "all") filters.status = activeStatus
      if (search) filters.search = search

      const result = await getAudits(filters as any, page, 20)
      setAudits(result.data)
      setPagination(result.pagination)
    } catch {
      setAudits([])
    } finally {
      setLoading(false)
    }
  }, [activeCategory, activeStatus, search])

  useEffect(() => {
    fetchAudits(pagination.page)
  }, [fetchAudits])

  const handlePageChange = useCallback((page: number) => {
    fetchAudits(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [fetchAudits])

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setPagination((p) => ({ ...p, page: 1 }))
    fetchAudits(1)
  }, [fetchAudits])

  const pageTitle = activeCategory === "all"
    ? "Toda la Actividad"
    : `Actividad de ${allCategories.find((c) => c.value === activeCategory)?.label || ""}`

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Auditoría</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Historial completo de acciones del sistema. Filtra por categoría, estado o busca por texto.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="glass p-1.5 rounded-xl border border-white/5 flex flex-wrap gap-1">
        {allCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat.value
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
          >
            <Icon name={cat.icon} className="text-sm" />
            {cat.label}
          </button>
        ))}
      </section>

      {/* Filters */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status filters */}
          <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl border border-white/5">
            <button
              onClick={() => handleStatusChange("all")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeStatus === "all"
                  ? "bg-primary text-white"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Todos
            </button>
            {(Object.entries(statusStyles) as [AuditStatus, typeof statusStyles.info][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  activeStatus === key
                    ? `${val.bg} ${val.color} border ${val.border}`
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Icon name="magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en auditorías..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </form>
        </div>
      </section>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">
          {loading ? "Cargando..." : `${pagination.total} registro${pagination.total !== 1 ? "s" : ""}`}
        </p>
        <p className="text-xs text-on-surface-variant">
          Página {pagination.page} de {pagination.totalPages}
        </p>
      </div>

      {/* Audit Timeline */}
      <section className="glass rounded-xl border border-white/5 p-5">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
                <Skeleton className="h-2.5 w-16" />
              </div>
            ))}
          </div>
        ) : audits.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="text-box-check" className="text-4xl text-on-surface-variant/30 block mx-auto mb-3" />
            <p className="text-sm text-on-surface-variant">No hay auditorías para este filtro</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-1">
              {audits.map((audit) => {
                const cat = categoryColor[audit.category] || categoryColor.system
                const st = statusStyles[audit.status] || statusStyles.info
                return (
                  <div key={audit.id} className="flex gap-3 items-start relative py-3 group">
                    <div className={`w-9 h-9 rounded-full ${cat.bg} flex items-center justify-center z-10 shrink-0`}>
                      <Icon name={cat.icon} className={`text-sm ${cat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-on-surface leading-snug">{audit.message}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${st.bg} ${st.color} border ${st.border}`}>
                              {st.label}
                            </span>
                            <span className="text-[11px] text-on-surface-variant/60">
                              {allCategories.find((c) => c.value === audit.category)?.label || audit.category}
                            </span>
                            {audit.entity_type && (
                              <>
                                <span className="text-on-surface-variant/30">·</span>
                                <span className="text-[11px] text-on-surface-variant">{audit.entity_type}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-on-surface-variant/50 whitespace-nowrap shrink-0">
                          {formatTimestamp(audit.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <section className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5"
          >
            <Icon name="chevron-left" className="text-sm" />
            Anterior
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (pagination.totalPages <= 7) return true
                if (p === 1 || p === pagination.totalPages) return true
                if (Math.abs(p - pagination.page) <= 1) return true
                return false
              })
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="text-on-surface-variant/40 text-xs px-1">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      pagination.page === p
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "glass text-on-surface-variant hover:text-on-surface border border-white/5"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-2 glass rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/5"
          >
            Siguiente
            <Icon name="chevron-right" className="text-sm" />
          </button>
        </section>
      )}
    </div>
  )
}

export default function AuditPage() {
  return (
    <Suspense fallback={
      <div className="space-y-5">
        <div>
          <Skeleton className="h-8 w-48 rounded mb-2" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="glass rounded-xl border border-white/5 p-5 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
              <Skeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      </div>
    }>
      <AuditPageInner />
    </Suspense>
  )
}
