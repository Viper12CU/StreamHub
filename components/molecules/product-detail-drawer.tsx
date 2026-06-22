"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { statusMap, productTypeMap, formatDateFull } from "@/lib/constants/products"
import { getProductById, getProductMetrics, deleteProduct, bulkAction, clearProductCache, type ProductWithDetails, type ProductMetrics } from "@/lib/api/products"
import { sileo } from "sileo"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ProductDetailDrawerProps {
  productId: string
  onClose: () => void
  onEdit: (product: ProductWithDetails) => void
  onActionChange?: () => void
}

function DrawerSkeleton() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-60" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-xl p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="p-3 bg-surface-container-low rounded-lg space-y-2">
                <Skeleton className="h-2 w-16" />
                <Skeleton className="h-5 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductDetailDrawer({ productId, onClose, onEdit, onActionChange }: ProductDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null)
  const [confirmAction, setConfirmAction] = useState<"archive" | "delete" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 200)
  }, [onClose])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    setTimeout(() => closeRef.current?.focus(), 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
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
    if (!productId) return
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const [productData, metricsData] = await Promise.all([
          getProductById(productId),
          getProductMetrics(productId),
        ])
        if (!cancelled) {
          setProduct(productData)
          setMetrics(metricsData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar el producto")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [productId])

  const handleArchive = async () => {
    if (!product) return
    setActionLoading(true)
    try {
      await bulkAction({ action: "archive", ids: [product.id] })
      sileo.success({ title: "Exito", description: "Producto archivado correctamente" })
      onActionChange?.()
      handleClose()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo archivar" })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return
    setActionLoading(true)
    try {
      await deleteProduct(product.id)
      sileo.success({ title: "Exito", description: "Producto eliminado correctamente" })
      onActionChange?.()
      handleClose()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo eliminar" })
    } finally {
      setActionLoading(false)
    }
  }

  const confirmMessages = {
    archive: {
      title: "Archivar producto",
      desc: "El producto pasará a estado archivado y no será visible en la tienda. Podrás restaurarlo más adelante.",
      icon: "archive",
      color: "amber",
    },
    delete: {
      title: "Eliminar producto",
      desc: "Esta acción eliminará permanentemente el producto y todos sus datos asociados. No se puede deshacer.",
      icon: "delete",
      color: "red",
    },
  } as const;

    if (!product?.slug) return
    try {
      await navigator.clipboard.writeText(product.slug)
      sileo.success({ title: "Copiado", description: "Slug copiado al portapapeles" })
    } catch {
      sileo.error({ title: "Error", description: "No se pudo copiar el slug" })
    }
  }

  const drawerContent = (
    <div
      className={`fixed inset-0 flex justify-end transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        className={`relative w-full max-w-lg bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col transition-transform duration-300 ${closing ? "translate-x-full" : "translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <h2 id="drawer-title" className="text-base font-semibold text-on-surface">Detalle del Producto</h2>
          <div className="flex items-center gap-2">
            {!loading && product && (
              <StatusBadge
                status={statusMap[product.status]?.label || product.status}
                variant={statusMap[product.status]?.variant || "neutral"}
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
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Reintentar
              </button>
            </div>
          ) : product ? (
            <div className="p-5 space-y-5">
              {/* Product Header */}
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                  style={{ backgroundColor: product.platform_color }}
                >
                  {product.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-on-surface">{product.name}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{product.description || "Sin descripción"}</p>
                </div>
              </div>

              {/* Basic Information */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="information" className="text-sm text-primary" />
                  Información Básica
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Plataforma", value: product.platform_name },
                    { label: "Tipo", value: productTypeMap[product.product_type] || product.product_type },
                    { label: "Slug", value: product.slug, copyable: true },
                    { label: "Creado", value: formatDateFull(product.created_at) },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs font-medium text-on-surface truncate">{item.value}</p>
                        {item.copyable && (
                          <button
                            onClick={copySlug}
                            className="shrink-0 p-0.5 rounded hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                            aria-label="Copiar slug"
                          >
                            <Icon name="content-copy" className="text-[10px] text-on-surface-variant" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {product.description && (
                  <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descripción</p>
                    <p className="text-xs text-on-surface mt-1 leading-relaxed">{product.description}</p>
                  </div>
                )}
              </section>

              {/* Pricing */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="credit-card-outline" className="text-sm text-primary" />
                  Precios
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Venta</p>
                    <p className="text-lg font-bold text-on-surface mt-1">${Number(product.price_sale).toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Costo</p>
                    <p className="text-lg font-bold text-on-surface mt-1">${Number(product.price_cost ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-[10px] text-primary uppercase tracking-wider">Margen</p>
                    <p className="text-lg font-bold text-primary mt-1">{metrics?.margin != null ? `${metrics.margin}%` : "N/A"}</p>
                  </div>
                </div>
              </section>

              {/* Inventory */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="package-variant-closed" className="text-sm text-primary" />
                  Inventario
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-[10px] text-green-400 uppercase tracking-wider">Disponibles</p>
                    <p className="text-lg font-bold text-green-400 mt-1">{metrics?.available_units ?? product.available_units}</p>
                  </div>
                  <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-[10px] text-amber-500 uppercase tracking-wider">Reservados</p>
                    <p className="text-lg font-bold text-amber-500 mt-1">{metrics?.reserved_units ?? product.reserved_units}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Vendidos</p>
                    <p className="text-lg font-bold text-on-surface mt-1">{metrics?.sold_units ?? product.sold_units}</p>
                  </div>
                </div>
              </section>

              {/* Sales Performance */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="trending-up" className="text-sm text-primary" />
                  Rendimiento de Ventas
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-[10px] text-primary uppercase tracking-wider">Ingresos</p>
                    <p className="text-lg font-bold text-primary mt-1">${(metrics?.total_revenue ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Órdenes</p>
                    <p className="text-lg font-bold text-on-surface mt-1">{metrics?.total_orders ?? 0}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="text-[10px] text-secondary uppercase tracking-wider">Conversión</p>
                    <p className="text-lg font-bold text-secondary mt-1">{metrics?.conversion_rate != null ? `${metrics.conversion_rate}%` : "N/A"}</p>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!loading && !error && product && (
          <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
            <button
              onClick={() => onEdit(product)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Icon name="pencil" className="text-sm" />
              Editar Producto
            </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmAction("archive")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5 focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <Icon name="archive" className="text-sm" />
                  Archivar
                </button>
                <button
                  onClick={() => setConfirmAction("delete")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20 focus-visible:ring-2 focus-visible:ring-error/50"
                >
                  <Icon name="delete" className="text-sm" />
                  Eliminar
                </button>
                {/* Confirmation Dialog */}
                {confirmAction && (
                  <ConfirmDialog
                    open={!!confirmAction}
                    onClose={() => setConfirmAction(null)}
                    loading={actionLoading}
                    title={confirmMessages[confirmAction].title}
                    description={confirmMessages[confirmAction].desc}
                    icon={confirmMessages[confirmAction].icon}
                    color={confirmMessages[confirmAction].color}
                    onConfirm={() => {
                      if (confirmAction === "delete") {
                        handleDelete()
                      } else {
                        handleArchive()
                      }
                    }}
                  />
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
