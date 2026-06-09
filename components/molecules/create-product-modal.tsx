"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { usePlatforms } from "@/hooks/use-platforms"
import { productTypes, generateSlug } from "@/lib/constants/products"
import type { CreateProductInput, ProductType, ProductStatus } from "@/lib/api/products"
import { sileo } from "sileo"

interface CreateProductModalProps {
  onClose: () => void
  onCreate: (data: CreateProductInput) => Promise<void>
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Paso ${currentStep} de ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex-1 flex items-center gap-2">
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200",
            s < currentStep ? "bg-primary text-white" :
            s === currentStep ? "bg-primary text-white ring-4 ring-primary/20" :
            "bg-surface-container-high text-on-surface-variant"
          )}>
            {s < currentStep ? (
              <span className="material-symbols-outlined text-sm">check</span>
            ) : s}
          </div>
          {s < totalSteps && (
            <div className={cn(
              "flex-1 h-0.5 rounded-full transition-colors duration-200",
              s < currentStep ? "bg-primary" : "bg-surface-container-high"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

export function CreateProductModal({ onClose, onCreate }: CreateProductModalProps) {
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { platforms } = usePlatforms()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    platform_id: "",
    product_type: "" as ProductType | "",
    price_sale: "",
    price_cost: "",
    currency: "USD",
    stock_initial: "",
    low_stock_threshold: "5",
    status: "active" as ProductStatus,
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
      slug: prev.slug === generateSlug(formData.name) || prev.slug === "" ? generateSlug(name) : prev.slug,
    }))
  }

  const margin = (() => {
    const sale = parseFloat(formData.price_sale)
    const cost = parseFloat(formData.price_cost)
    if (!sale || sale <= 0 || isNaN(cost)) return null
    return Math.round(((sale - cost) / sale) * 100)
  })()

  const handleSubmit = async () => {
    if (!formData.name || !formData.platform_id || !formData.product_type || !formData.price_sale) return
    try {
      setSubmitting(true)
      await onCreate({
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        platform_id: formData.platform_id,
        product_type: formData.product_type as ProductType,
        price_sale: parseFloat(formData.price_sale),
        price_cost: formData.price_cost ? parseFloat(formData.price_cost) : undefined,
        currency: formData.currency,
        stock_initial: formData.stock_initial ? parseInt(formData.stock_initial) : undefined,
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        status: formData.status,
      })
    } catch {
      // Error handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} aria-hidden="true" />
      <div
        ref={modalRef}
        className={`relative w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-transform duration-200 ${closing ? "scale-95" : "scale-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">add_box</span>
            </div>
            <div>
              <h2 id="create-modal-title" className="text-lg font-semibold text-on-surface">Crear Producto</h2>
              <p className="text-[11px] text-on-surface-variant">Paso {step} de 4</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} totalSteps={4} />

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Información Básica</h3>
                <p className="text-[11px] text-on-surface-variant">Detalles principales del producto</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="prod-name" className="text-[11px] font-medium text-on-surface-variant">Nombre del Producto *</label>
                  <input
                    ref={firstInputRef}
                    id="prod-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej: Netflix Premium 4K"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="prod-slug" className="text-[11px] font-medium text-on-surface-variant">Slug</label>
                  <input
                    id="prod-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="netflix-premium-4k"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="prod-desc" className="text-[11px] font-medium text-on-surface-variant">Descripción</label>
                  <textarea
                    id="prod-desc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe las características del producto..."
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="prod-platform" className="text-[11px] font-medium text-on-surface-variant">Plataforma *</label>
                    <div className="relative">
                      <select
                        id="prod-platform"
                        value={formData.platform_id}
                        onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="">Seleccionar...</option>
                        {platforms.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">unfold_more</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prod-type" className="text-[11px] font-medium text-on-surface-variant">Tipo de Producto *</label>
                    <div className="relative">
                      <select
                        id="prod-type"
                        value={formData.product_type}
                        onChange={(e) => setFormData({ ...formData, product_type: e.target.value as ProductType })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="">Seleccionar...</option>
                        {productTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">unfold_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Precios</h3>
                <p className="text-[11px] text-on-surface-variant">Configura los precios del producto</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="prod-price-sale" className="text-[11px] font-medium text-on-surface-variant">Precio de Venta *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                      <input
                        id="prod-price-sale"
                        type="number"
                        value={formData.price_sale}
                        onChange={(e) => setFormData({ ...formData, price_sale: e.target.value })}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prod-price-cost" className="text-[11px] font-medium text-on-surface-variant">Precio de Costo</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                      <input
                        id="prod-price-cost"
                        type="number"
                        value={formData.price_cost}
                        onChange={(e) => setFormData({ ...formData, price_cost: e.target.value })}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prod-currency" className="text-[11px] font-medium text-on-surface-variant">Moneda</label>
                    <div className="relative">
                      <select
                        id="prod-currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="MXN">MXN ($)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">unfold_more</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-low border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                      <span className="text-[11px] font-medium text-on-surface-variant">Margen Estimado</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{margin != null ? `${margin}%` : "N/A"}</span>
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

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Inventario</h3>
                <p className="text-[11px] text-on-surface-variant">Gestiona el stock del producto</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="prod-stock" className="text-[11px] font-medium text-on-surface-variant">Stock Inicial *</label>
                    <input
                      id="prod-stock"
                      type="number"
                      value={formData.stock_initial}
                      onChange={(e) => setFormData({ ...formData, stock_initial: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prod-threshold" className="text-[11px] font-medium text-on-surface-variant">Umbral Stock Bajo</label>
                    <input
                      id="prod-threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                      placeholder="5"
                      min="0"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-on-surface-variant">Estado</label>
                  <div className="flex gap-3">
                    {(["active", "draft", "archived"] as const).map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors"
                      >
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === status}
                          onChange={() => setFormData({ ...formData, status })}
                          className="accent-primary w-4 h-4"
                        />
                        <span className="text-xs text-on-surface">{status === "active" ? "Activo" : status === "draft" ? "Borrador" : "Archivado"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Resumen</h3>
                <p className="text-[11px] text-on-surface-variant">Revisa los datos antes de crear</p>
              </div>
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 bg-surface-container-low/50 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {formData.name ? formData.name[0].toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{formData.name || "Sin nombre"}</p>
                      <p className="text-[11px] text-on-surface-variant">
                        {platforms.find((p) => p.id === formData.platform_id)?.name || "Sin plataforma"} • {productTypes.find((t) => t.value === formData.product_type)?.label || "Sin tipo"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Precio de Venta</span>
                    <span className="text-sm font-semibold text-on-surface">${parseFloat(formData.price_sale || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Precio de Costo</span>
                    <span className="text-sm text-on-surface">${parseFloat(formData.price_cost || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Margen</span>
                    <span className="text-sm font-semibold text-primary">{margin != null ? `${margin}%` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Stock Inicial</span>
                    <span className="text-sm text-on-surface">{formData.stock_initial || "0"} unidades</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-on-surface-variant">Estado</span>
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-semibold rounded-full",
                      formData.status === "active" ? "bg-green-500/10 text-green-400" :
                      formData.status === "draft" ? "bg-surface-container-high text-on-surface-variant" :
                      "bg-surface-container-high text-on-surface-variant"
                    )}>
                      {formData.status === "active" ? "Activo" : formData.status === "draft" ? "Borrador" : "Archivado"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary/[0.08] border border-primary/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                <p className="text-xs text-on-surface">El producto será creado y estará visible en el catálogo inmediatamente.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/5 bg-surface-container-lowest/50">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="material-symbols-outlined text-sm">{step > 1 ? "arrow_back" : "close"}</span>
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          <div className="flex gap-2">
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Siguiente
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
                  submitting
                    ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                )}
              >
                {submitting ? (
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">check</span>
                )}
                {submitting ? "Creando..." : "Crear Producto"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
