"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { ButtonSpinner } from "@/components/atoms/button-spinner"
import { Icon } from "@/components/atoms/icon"
import { usePlatforms } from "@/hooks/use-platforms"
import { productTypes, statusOptions, generateSlug } from "@/lib/constants/products"
import {
  updateProduct,
  type ProductWithDetails,
  type ProductType,
  type ProductStatus,
} from "@/lib/api/products"
import { sileo } from "sileo"

interface EditProductModalProps {
  product: ProductWithDetails
  onClose: () => void
  onUpdate: () => void
}

export function EditProductModal({ product, onClose, onUpdate }: EditProductModalProps) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState<"info" | "pricing" | "inventory" | "status">("info")
  const { platforms } = usePlatforms()
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    platform_id: product.platform_id,
    product_type: product.product_type as ProductType,
    price_sale: String(product.price_sale),
    price_cost: product.price_cost != null ? String(product.price_cost) : "",
    currency: product.currency,
    stock_initial: String(product.stock_initial),
    low_stock_threshold: String(product.low_stock_threshold),
    status: product.status as ProductStatus,
  })
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 200)
  }, [onClose])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    setTimeout(() => firstInputRef.current?.focus(), 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
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

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(product.name) || prev.slug === "" ? generateSlug(name) : prev.slug,
    }))
  }

  const margin = (() => {
    const sale = parseFloat(formData.price_sale)
    const cost = parseFloat(formData.price_cost)
    if (!sale || sale <= 0 || isNaN(cost)) return null
    return Math.round(((sale - cost) / sale) * 100)
  })()

  const hasChanges = () => {
    return (
      formData.name !== product.name ||
      formData.slug !== product.slug ||
      formData.description !== (product.description || "") ||
      formData.platform_id !== product.platform_id ||
      formData.product_type !== product.product_type ||
      Number(formData.price_sale) !== Number(product.price_sale) ||
      (formData.price_cost ? Number(formData.price_cost) : null) !== (product.price_cost != null ? Number(product.price_cost) : null) ||
      formData.currency !== product.currency ||
      (formData.stock_initial ? Number(formData.stock_initial) : null) !== (product.stock_initial != null ? Number(product.stock_initial) : null) ||
      Number(formData.low_stock_threshold) !== Number(product.low_stock_threshold) ||
      formData.status !== product.status
    )
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.platform_id || !formData.product_type || !formData.price_sale) return
    try {
      setSubmitting(true)
      await updateProduct(product.id, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        platform_id: formData.platform_id,
        product_type: formData.product_type,
        price_sale: parseFloat(formData.price_sale),
        price_cost: formData.price_cost ? parseFloat(formData.price_cost) : undefined,
        currency: formData.currency,
        stock_initial: formData.stock_initial ? parseInt(formData.stock_initial) : undefined,
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        status: formData.status,
      })
      sileo.success({ title: "Exito", description: "Producto actualizado correctamente" })
      onUpdate()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo actualizar el producto" })
    } finally {
      setSubmitting(false)
    }
  }

  const sections = [
    { id: "info" as const, label: "Información", icon: "information" },
    { id: "pricing" as const, label: "Precios", icon: "credit-card-outline" },
    { id: "inventory" as const, label: "Inventario", icon: "package-variant-closed" },
    { id: "status" as const, label: "Estado", icon: "flag-outline" },
  ]

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-product-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div
        ref={modalRef}
        className={`relative glass rounded-2xl w-full max-w-[560px] max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-hidden flex flex-col transition-transform duration-200 ${closing ? "scale-95" : "scale-100"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: product.platform_color }}
            >
              {product.name[0]}
            </div>
            <div>
              <h2 id="edit-product-modal-title" className="text-base font-semibold text-on-surface">Editar Producto</h2>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{product.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Cerrar modal"
          >
            <Icon name="close" className="text-sm" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1" role="tablist" aria-label="Secciones del formulario">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                role="tab"
                aria-selected={activeSection === s.id}
                aria-controls={`panel-${s.id}`}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
                  activeSection === s.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <Icon name={s.icon} className="text-xs" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5" role="tabpanel" id={`panel-${activeSection}`}>
          {activeSection === "info" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información Básica</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="edit-prod-name" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre *</label>
                  <input
                    ref={firstInputRef}
                    id="edit-prod-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Nombre del producto"
                  />
                </div>
                <div>
                  <label htmlFor="edit-prod-slug" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Slug *</label>
                  <input
                    id="edit-prod-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono"
                    placeholder="producto-slug"
                  />
                </div>
                <div>
                  <label htmlFor="edit-prod-desc" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descripción</label>
                  <textarea
                    id="edit-prod-desc"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                    placeholder="Describe el producto..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-prod-platform" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Plataforma *</label>
                    <div className="relative mt-1">
                      <select
                        id="edit-prod-platform"
                        value={formData.platform_id}
                        onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="">Seleccionar...</option>
                        {platforms.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-prod-type" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Tipo *</label>
                    <div className="relative mt-1">
                      <select
                        id="edit-prod-type"
                        value={formData.product_type}
                        onChange={(e) => setFormData({ ...formData, product_type: e.target.value as ProductType })}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        {productTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "pricing" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Precios</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-prod-price-sale" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio de Venta *</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                      <input
                        id="edit-prod-price-sale"
                        type="number"
                        value={formData.price_sale}
                        onChange={(e) => setFormData({ ...formData, price_sale: e.target.value })}
                        className="w-full pl-7 pr-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-prod-price-cost" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio de Costo</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                      <input
                        id="edit-prod-price-cost"
                        type="number"
                        value={formData.price_cost}
                        onChange={(e) => setFormData({ ...formData, price_cost: e.target.value })}
                        className="w-full pl-7 pr-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-prod-currency" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Moneda</label>
                  <div className="relative mt-1">
                    <select
                      id="edit-prod-currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="MXN">MXN ($)</option>
                    </select>
                    <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
                  </div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="chart-areaspline" className="text-primary text-sm" />
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Margen</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{margin != null ? `${margin}%` : "N/A"}</span>
                  </div>
                  {margin != null && (
                    <div className="mt-2 w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(margin, 100)}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "inventory" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Inventario</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-prod-stock" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Stock Inicial</label>
                    <input
                      id="edit-prod-stock"
                      type="number"
                      value={formData.stock_initial}
                      onChange={(e) => setFormData({ ...formData, stock_initial: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-prod-threshold" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Umbral Stock Bajo</label>
                    <input
                      id="edit-prod-threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="5"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "status" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Estado</h3>
              <div className="space-y-3">
                {statusOptions.map((status) => (
                  <div
                    key={status.value}
                    onClick={() => setFormData({ ...formData, status: status.value })}
                    role="radio"
                    aria-checked={formData.status === status.value}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFormData({ ...formData, status: status.value }) } }}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      formData.status === status.value
                        ? "bg-primary/10 border-primary/30"
                        : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("text-xs font-semibold", formData.status === status.value ? "text-primary" : "text-on-surface")}>{status.label}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{status.desc}</p>
                      </div>
                      {formData.status === status.value && (
                        <Icon name="check-circle" className="text-sm text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5 focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Icon name="close" className="text-sm" />
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges()}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
              submitting || !hasChanges()
                ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
            )}
          >
            {submitting ? (
              <ButtonSpinner />
            ) : (
              <Icon name="check" className="text-sm" />
            )}
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
