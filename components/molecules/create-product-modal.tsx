"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import { usePlatforms } from "@/hooks/use-platforms"
import { productTypes, generateSlug } from "@/lib/constants/products"
import type { CreateProductInput, ProductType, ProductStatus } from "@/lib/api/products"

interface CreateProductModalProps {
  onClose: () => void
  onCreate: (data: CreateProductInput) => Promise<void>
}

const steps = [
  { label: "Info", icon: "information" },
  { label: "Precios", icon: "currency-usd" },
  { label: "Inventario", icon: "package-variant" },
  { label: "Resumen", icon: "text-box" },
]

export function CreateProductModal({ onClose, onCreate }: CreateProductModalProps) {
  const [step, setStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

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

  const canProceed = () => {
    if (step === 0) return formData.name.trim() !== "" && formData.platform_id !== "" && formData.product_type !== ""
    return true
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.platform_id || !formData.product_type || !formData.price_sale) return
    try {
      setLoading(true)
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
      setLoading(false)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-[600px] max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h2 className="text-base font-semibold text-on-surface">Crear Producto</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Paso {step + 1} de {steps.length}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <Icon name="close" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0",
                  i <= step
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface-container-high text-on-surface-variant"
                )}>
                  <Icon name={s.icon} size="sm" />
                </div>
                <span className={cn(
                  "text-[12px] font-semibold hidden sm:block",
                  i <= step ? "text-primary" : "text-on-surface-variant"
                )}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-px mx-1",
                    i < step ? "bg-primary" : "bg-surface-container-high"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          {/* Step 1: Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información Básica</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Ej: Netflix Premium 4K"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono"
                    placeholder="netflix-premium-4k"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                    placeholder="Describe las características del producto..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Plataforma *</label>
                    <div className="relative mt-1">
                      <select
                        value={formData.platform_id}
                        onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="">Seleccionar...</option>
                        {platforms.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Tipo *</label>
                    <div className="relative mt-1">
                      <select
                        value={formData.product_type}
                        onChange={(e) => setFormData({ ...formData, product_type: e.target.value as ProductType })}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="">Seleccionar...</option>
                        {productTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Precios */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Precios</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Venta *</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                      <input
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
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Costo</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">$</span>
                      <input
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
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Moneda</label>
                    <div className="relative mt-1">
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="MXN">MXN ($)</option>
                      </select>
                      <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-low border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="chart-areaspline" className="text-primary text-sm" />
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Margen Estimado</span>
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

          {/* Step 3: Inventario */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Inventario</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Stock Inicial *</label>
                    <input
                      type="number"
                      value={formData.stock_initial}
                      onChange={(e) => setFormData({ ...formData, stock_initial: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Umbral Stock Bajo</label>
                    <input
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="5"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(["active", "draft", "archived"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFormData({ ...formData, status })}
                        className={cn(
                          "py-2 rounded-xl text-xs font-semibold transition-all border capitalize",
                          formData.status === status
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                        )}
                      >
                        {status === "active" ? "Activo" : status === "draft" ? "Borrador" : "Archivado"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Resumen */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Resumen del Producto</h3>
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {formData.name ? formData.name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{formData.name || "Sin nombre"}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {platforms.find((p) => p.id === formData.platform_id)?.name || "Sin plataforma"} • {productTypes.find((t) => t.value === formData.product_type)?.label || "Sin tipo"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio de Venta</span>
                  <span className="text-xs font-bold text-on-surface">${parseFloat(formData.price_sale || "0").toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio de Costo</span>
                  <span className="text-xs font-medium text-on-surface">${parseFloat(formData.price_cost || "0").toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Margen</span>
                  <span className="text-sm font-bold text-primary">{margin != null ? `${margin}%` : "N/A"}</span>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Stock Inicial</span>
                  <span className="text-xs font-medium text-on-surface">{formData.stock_initial || "0"} unidades</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</span>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold rounded-full",
                    formData.status === "active" ? "bg-green-500/10 text-green-400" :
                    formData.status === "draft" ? "bg-surface-container-high text-on-surface-variant" :
                    "bg-surface-container-high text-on-surface-variant"
                  )}>
                    {formData.status === "active" ? "Activo" : formData.status === "draft" ? "Borrador" : "Archivado"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <Icon name="information" className="text-sm text-primary" />
                  <p className="text-[11px] text-primary">El producto será creado y estará visible en el catálogo inmediatamente.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5"
          >
            <Icon name={step > 0 ? "arrow-left" : "close"} className="text-sm" />
            {step > 0 ? "Anterior" : "Cancelar"}
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <Icon name="arrow-right" className="text-sm" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Icon name="loading" className="text-sm animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Icon name="check" className="text-sm" />
                  Crear Producto
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
