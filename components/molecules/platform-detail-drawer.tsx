"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Icon } from "@/components/atoms/icon"
import {
  getPlatformById,
  getPlatformProducts,
  getPlatformAnalytics,
  type PlatformWithMetrics,
  type PlatformProduct,
  type PlatformAnalytics,
} from "@/lib/api/platforms"
import { getInventory, type InventoryWithDetails } from "@/lib/api/inventory"
import { sileo } from "sileo"

interface PlatformDetailDrawerProps {
  platformId: string
  onClose: () => void
  onEdit: (platform: PlatformWithMetrics) => void
  inventoryCounts?: Record<string, number>
}

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activa", variant: "success" },
  inactive: { label: "Inactiva", variant: "warning" },
  archived: { label: "Archivada", variant: "neutral" },
}

function DrawerSkeleton() {
  return (
    <div className="p-5 space-y-5">
      {/* Platform Info */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-10" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-surface-container-low rounded-lg space-y-2">
            <Skeleton className="h-2 w-10" />
            <Skeleton className="w-16 h-16 rounded-xl" />
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg space-y-2">
            <Skeleton className="h-2 w-10" />
            <Skeleton className="w-full h-16 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-8 mx-auto" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20 space-y-1.5">
            <Skeleton className="h-2 w-10 mx-auto" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
          <div className="text-center p-3 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-16 mx-auto" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20 space-y-1.5">
            <Skeleton className="h-2 w-14 mx-auto" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20 space-y-1.5">
            <Skeleton className="h-2 w-14 mx-auto" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
          <div className="text-center p-3 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-14 mx-auto" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-12 mx-auto" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
          <div className="text-center p-3 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-10 mx-auto" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
          <div className="text-center p-3 bg-surface-container-low rounded-lg space-y-1.5">
            <Skeleton className="h-2 w-12 mx-auto" />
            <Skeleton className="h-5 w-10 mx-auto" />
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="space-y-2">
          <div className="flex gap-4 pb-2 border-b border-white/5">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-2 w-16 ml-auto" />
            <Skeleton className="h-2 w-16 ml-auto" />
            <Skeleton className="h-2 w-12 ml-auto" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
              <Skeleton className="h-4 w-12 ml-auto rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PlatformDetailDrawer({ platformId, onClose, onEdit, inventoryCounts = {} }: PlatformDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [platform, setPlatform] = useState<PlatformWithMetrics | null>(null)
  const [products, setProducts] = useState<PlatformProduct[]>([])
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null)
  const [platformInventory, setPlatformInventory] = useState<InventoryWithDetails[]>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 200)
  }, [onClose])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    setTimeout(() => closeRef.current?.focus(), 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleClose])

  useEffect(() => {
    if (!platformId) return
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const [platData, prodData, analyticsData, inventoryData] = await Promise.all([
          getPlatformById(platformId),
          getPlatformProducts(platformId),
          getPlatformAnalytics(platformId),
          getInventory({ platform_id: platformId, limit: 1000 }),
        ])
        if (!cancelled) {
          setPlatform(platData)
          setProducts(prodData)
          setAnalytics(analyticsData)
          setPlatformInventory(inventoryData.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar la plataforma")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [platformId])

  const inventoryStats = useMemo(() => {
    const available = platformInventory.filter((i) => i.status === "available").length
    const assigned = platformInventory.filter((i) => i.status === "assigned").length
    const expired = platformInventory.filter((i) => i.status === "expired").length
    const reserved = platformInventory.filter((i) => i.status === "reserved").length
    const suspended = platformInventory.filter((i) => i.status === "suspended").length
    return { available, assigned, expired, reserved, suspended, total: platformInventory.length }
  }, [platformInventory])

  function getLetter(name: string) {
    return name.charAt(0).toUpperCase()
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" })
  }

  function getContrastColor(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#1a1a2e" : "#ffffff"
  }

  const drawerContent = (
    <div
      className={`fixed inset-0 flex justify-end transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div
        ref={drawerRef}
        className={`relative w-full max-w-2xl max-sm:max-w-full bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col transition-transform duration-300 ${closing ? "translate-x-full" : "translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="w-10 h-10 rounded-xl" />
            ) : error ? (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-error/10">
                <Icon name="alert-circle" className="text-error text-sm" />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black italic shadow-lg"
                style={{ backgroundColor: platform?.color || "#666" }}
              >
                {platform ? getLetter(platform.name) : "?"}
              </div>
            )}
            <div>
              {loading ? (
                <Skeleton className="h-5 w-32 mb-1" />
              ) : (
                <h2 id="drawer-title" className="text-base font-semibold text-on-surface">{platform?.name || "Error"}</h2>
              )}
              {loading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                <p className="text-[10px] text-on-surface-variant capitalize">{platform?.category} • {platform?.slug}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && platform && (
              <StatusBadge
                status={statusMap[platform.status]?.label || platform.status}
                variant={statusMap[platform.status]?.variant || "neutral"}
              />
            )}
            <button
              ref={closeRef}
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Cerrar drawer"
            >
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <DrawerSkeleton />
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <Icon name="alert-circle" className="text-3xl text-error/50 block" />
              <p className="text-sm text-on-surface">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : platform ? (
            <div className="p-5 space-y-5">
              {/* Platform Info */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="information" className="text-sm text-primary" />
                  Información de la Plataforma
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Nombre", value: platform.name },
                    { label: "Slug", value: platform.slug },
                    { label: "Categoría", value: platform.category },
                    { label: "Fecha de Creación", value: formatDate(platform.created_at) },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                {platform.description && (
                  <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descripción</p>
                    <p className="text-xs text-on-surface mt-1 leading-relaxed">{platform.description}</p>
                  </div>
                )}
              </section>

              {/* Branding */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="palette" className="text-sm text-primary" />
                  Branding
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Logo</p>
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-black italic" style={{ backgroundColor: platform.color }}>
                      {getLetter(platform.name)}
                    </div>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Banner</p>
                    <div
                      className="w-full h-16 rounded-lg flex items-center justify-center text-[10px] border border-white/5"
                      style={{ backgroundColor: platform.color + "30" }}
                    >
                      <span className="font-semibold" style={{ color: getContrastColor(platform.color) }}>{platform.name}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Products Overview */}
              {analytics && (
                <section className="glass rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <Icon name="cart" className="text-sm text-primary" />
                    Resumen de Productos
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total</p>
                      <p className="text-lg font-bold text-on-surface mt-1">{analytics.products_count}</p>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-[10px] text-green-400 uppercase tracking-wider">Activos</p>
                      <p className="text-lg font-bold text-green-400 mt-1">{analytics.products_active}</p>
                    </div>
                    <div className="text-center p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Borradores</p>
                      <p className="text-lg font-bold text-on-surface mt-1">{analytics.products_draft}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Inventory Overview */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="package-variant" className="text-sm text-primary" />
                  Resumen de Inventario
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-[10px] text-green-400 uppercase tracking-wider">Disponibles</p>
                    <p className="text-lg font-bold text-green-400 mt-1">{inventoryStats.available}</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-[10px] text-primary uppercase tracking-wider">Asignados</p>
                    <p className="text-lg font-bold text-primary mt-1">{inventoryStats.assigned}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total</p>
                    <p className="text-lg font-bold text-on-surface mt-1">{inventoryStats.total}</p>
                  </div>
                </div>
              </section>

              {/* Revenue Metrics */}
              {analytics && (
                <section className="glass rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <Icon name="trending-up" className="text-sm text-primary" />
                    Métricas de Ingresos
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Mensual</p>
                      <p className="text-lg font-bold text-primary mt-1">${analytics.revenue_monthly.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total</p>
                      <p className="text-lg font-bold text-on-surface mt-1">${analytics.revenue_total.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Órdenes</p>
                      <p className="text-lg font-bold text-on-surface mt-1">{analytics.total_orders.toLocaleString()}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Performance */}
              {analytics && (
                <section className="glass rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <Icon name="speedometer" className="text-sm text-primary" />
                    Rendimiento
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Más Vendido</p>
                      <p className="text-xs font-medium text-on-surface mt-1">{analytics.best_selling_product || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Conversión</p>
                      <p className="text-xs font-bold text-green-400 mt-1">{analytics.conversion_rate || 0}%</p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Clientes</p>
                      <p className="text-xs font-bold text-on-surface mt-1">{analytics.customer_count.toLocaleString()}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Top Products */}
              {products.length > 0 ? (
                <section className="glass rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <Icon name="trophy" className="text-sm text-primary" />
                    Top Productos
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
                        <tr>
                          <th className="py-2" scope="col">Producto</th>
                          <th className="py-2 text-right" scope="col">Inventario</th>
                          <th className="py-2 text-right" scope="col">Precio USD</th>
                          <th className="py-2 text-right" scope="col">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {products.slice(0, 5).map((product, i) => (
                          <tr key={i}>
                            <td className="py-2 text-xs font-medium text-on-surface">{product.title}</td>
                            <td className="py-2 text-xs text-on-surface-variant text-right">{product.stock_status}</td>
                            <td className="py-2 text-xs font-semibold text-primary text-right">${product.price_usd}</td>
                            <td className="py-2 text-xs text-right">
                              <StatusBadge
                                status={product.active ? "Activo" : "Inactivo"}
                                variant={product.active ? "success" : "neutral"}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : (
                <div className="glass rounded-xl p-8 border border-white/5 text-center">
                  <Icon name="package-variant" className="text-3xl text-on-surface-variant/30 mb-2 block" />
                  <p className="text-sm text-on-surface-variant">Sin productos registrados</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && platform && (
          <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => platform && onEdit(platform)}
              >
                <Icon name="pencil" className="text-sm" />
                Editar Plataforma
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5 focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => sileo.success({ title: "Próximamente", description: "Analytics detallado en desarrollo" })}
              >
                <Icon name="chart-areaspline" className="text-sm" />
                Analytics
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20 focus-visible:ring-2 focus-visible:ring-amber-500/50"
                onClick={() => sileo.success({ title: "Próximamente", description: "Archivado de plataforma en desarrollo" })}
              >
                <Icon name="archive" className="text-sm" />
                Archivar
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20 focus-visible:ring-2 focus-visible:ring-error/50"
                onClick={() => sileo.success({ title: "Próximamente", description: "Eliminación de plataforma en desarrollo" })}
              >
                <Icon name="delete" className="text-sm" />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
