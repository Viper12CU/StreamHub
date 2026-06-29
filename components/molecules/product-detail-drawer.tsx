"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Icon } from "@/components/atoms/icon"
import FileUpload from "@/components/molecules/file-upload"
import { Skeleton } from "@/components/ui/skeleton"
import { statusMap, productTypeMap, formatDateFull } from "@/lib/constants/products"
import { getProductById, getProductMetrics, deleteProduct, bulkAction, uploadProductImage, deleteProductImage, clearProductCache, type ProductWithDetails, type ProductMetrics } from "@/lib/api/products"
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
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [confirmAction, setConfirmAction] = useState<"archive" | "activate" | "delete" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const previewOpenRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmDeleteImage, setConfirmDeleteImage] = useState(false)
  const [confirmEditImage, setConfirmEditImage] = useState(false)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [imageActionLoading, setImageActionLoading] = useState(false)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 200)
  }, [onClose])

  useEffect(() => { previewOpenRef.current = previewOpen }, [previewOpen])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    setTimeout(() => closeRef.current?.focus(), 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewOpenRef.current) { setPreviewOpen(false); return }
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
          setImageLoading(true)
          setImageError(false)
          setPreviewOpen(false)
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

  const handleStatusChange = async () => {
    if (!product) return
    const action = product.status === "archived" ? "activate" : "archive"
    setActionLoading(true)
    try {
      await bulkAction({ action, ids: [product.id] })
      sileo.success({
        title: "Exito",
        description: action === "archive" ? "Producto archivado correctamente" : "Producto activado correctamente",
      })
      clearProductCache()
      setConfirmAction(null)
      onActionChange?.()
      handleClose()
    } catch (err) {
      sileo.error({
        title: "Error",
        description: err instanceof Error ? err.message : action === "archive" ? "No se pudo archivar" : "No se pudo activar",
      })
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
      clearProductCache()
      setConfirmAction(null)
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
      title: "Archivar Producto",
      desc: `¿Archivar "${product?.name}"? No estará visible en la tienda. Podrás restaurarlo más adelante.`,
      icon: "archive",
      color: "amber",
    },
    activate: {
      title: "Activar Producto",
      desc: `¿Activar "${product?.name}"? Será visible y disponible para venta.`,
      icon: "check-circle",
      color: "green",
    },
    delete: {
      title: "Eliminar Producto",
      desc: `¿Eliminar "${product?.name}" permanentemente? Esta acción no se puede deshacer.`,
      icon: "delete",
      color: "red",
    },
  }

  const copySlug = async () => {
    if (!product?.slug) return
    try {
      await navigator.clipboard.writeText(product.slug)
      sileo.success({ title: "Copiado", description: "Slug copiado al portapapeles" })
    } catch {
      sileo.error({ title: "Error", description: "No se pudo copiar el slug" })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImageFile(file)
    setConfirmEditImage(true)
    e.target.value = ""
  }

  const handleUploadImage = async () => {
    if (!product || !pendingImageFile) return
    setImageActionLoading(true)
    try {
      const updated = await uploadProductImage(product.id, pendingImageFile)
      setProduct(prev => prev ? { ...prev, image_url: updated.image_url } : prev)
      setImageLoading(true)
      setImageError(false)
      sileo.success({ title: "Exito", description: "Imagen del producto actualizada" })
      setConfirmEditImage(false)
      setPendingImageFile(null)
      clearProductCache()
      onActionChange?.()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo subir la imagen" })
    } finally {
      setImageActionLoading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!product) return
    setImageActionLoading(true)
    try {
      await deleteProductImage(product.id)
      setProduct(prev => prev ? { ...prev, image_url: null } : prev)
      setPreviewOpen(false)
      sileo.success({ title: "Exito", description: "Imagen eliminada correctamente" })
      setConfirmDeleteImage(false)
      clearProductCache()
      onActionChange?.()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo eliminar la imagen" })
    } finally {
      setImageActionLoading(false)
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
              {/* Product Image */}
              {(product.image_url || product.thumbnail) ? (
                <div
                  className="group relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-low border border-white/5 cursor-pointer"
                  onClick={() => !imageError && setPreviewOpen(true)}
                >
                  {imageLoading && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  {imageError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                      <Icon name="image-off" className="text-2xl opacity-40" />
                      <p className="text-[10px] uppercase tracking-wider opacity-60">Error al cargar imagen</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={product.image_url || product.thumbnail || ""}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${imageLoading ? "opacity-0" : "opacity-100"} group-hover:blur-sm group-hover:scale-105`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => { setImageLoading(false); setImageError(true) }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Icon name="eye" className="text-lg text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video rounded-xl bg-surface-container-low border border-white/5 p-3 ">
                  <FileUpload
                    maxFiles={1}
                    maxFileSize="5MB"
                    acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                    className="!h-full [&_.filepond--panel]:!min-h-0 [&_.filepond--panel]:!h-full [&_.filepond--height]:!h-full"
                    labelIdle='<span style="font-size:13px">Arrastra la imagen o <span class="filepond--label-action">examina</span></span>'
                    onFilesChange={(files) => {
                      if (files.length > 0) {
                        setPendingImageFile(files[0])
                        setConfirmEditImage(true)
                      }
                    }}
                  />
                </div>
              )}

              {/* Image Preview Modal */}
              {previewOpen && (product.image_url || product.thumbnail) && (
                <div
                  className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                  onClick={() => setPreviewOpen(false)}
                >
                  {/* Top bar */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
                    <p className="text-sm text-white/70 font-medium truncate max-w-[60%]">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-500/30 transition-colors border border-white/20 focus-visible:ring-2 focus-visible:ring-white/50"
                        aria-label="Editar imagen"
                        title="Cambiar imagen"
                      >
                        <Icon name="pencil" className="text-lg" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteImage(true) }}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-error/30 transition-colors border border-white/20 focus-visible:ring-2 focus-visible:ring-white/50"
                        aria-label="Eliminar imagen"
                        title="Eliminar imagen"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                      <button
                        onClick={() => setPreviewOpen(false)}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20 focus-visible:ring-2 focus-visible:ring-white/50"
                        aria-label="Cerrar vista previa"
                      >
                        <Icon name="close" className="text-lg" />
                      </button>
                    </div>
                  </div>
                  <img
                    src={product.image_url || product.thumbnail || ""}
                    alt={product.name}
                    className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

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
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-colors border ${
                  product.status === "archived"
                    ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                }`}
                onClick={() => setConfirmAction(product.status === "archived" ? "activate" : "archive")}
              >
                <Icon name={product.status === "archived" ? "check-circle" : "archive"} className="text-sm" />
                {product.status === "archived" ? "Activar" : "Archivar"}
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20 focus-visible:ring-2 focus-visible:ring-error/50"
                onClick={() => setConfirmAction("delete")}
              >
                <Icon name="delete" className="text-sm" />
                Eliminar
              </button>
            </div>
          </div>
        )}

        {confirmAction && (
          <ConfirmDialog
            open={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            onConfirm={() => {
              if (confirmAction === "delete") {
                handleDelete()
              } else {
                handleStatusChange()
              }
            }}
            title={confirmMessages[confirmAction].title}
            description={confirmMessages[confirmAction].desc}
            icon={confirmMessages[confirmAction].icon}
            color={confirmMessages[confirmAction].color}
            loading={actionLoading}
          />
        )}

        {confirmEditImage && (
          <ConfirmDialog
            open={confirmEditImage}
            onClose={() => { setConfirmEditImage(false); setPendingImageFile(null) }}
            onConfirm={handleUploadImage}
            title="Cambiar Imagen"
            description={`¿Actualizar la imagen de "${product?.name}"? La imagen anterior será reemplazada permanentemente.`}
            icon="image"
            color="blue"
            loading={imageActionLoading}
          />
        )}

        {confirmDeleteImage && (
          <ConfirmDialog
            open={confirmDeleteImage}
            onClose={() => setConfirmDeleteImage(false)}
            onConfirm={handleDeleteImage}
            title="Eliminar Imagen"
            description={`¿Eliminar la imagen de "${product?.name}"? El producto no tendrá imagen hasta que subas una nueva.`}
            icon="delete"
            color="red"
            loading={imageActionLoading}
          />
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
