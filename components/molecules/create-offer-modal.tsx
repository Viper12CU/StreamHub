"use client"

import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import { sileo } from "sileo"
import { getProducts, type ProductWithDetails } from "@/lib/api/products"
import type { CreateOfferInput } from "@/lib/api/offers"

interface CreateOfferModalProps {
  onClose: () => void
  onCreate: (data: CreateOfferInput) => Promise<void>
}

const steps = [
  { label: "Tipo", icon: "tag" },
  { label: "Detalle", icon: "information" },
  { label: "Productos", icon: "package-variant" },
  { label: "Vigencia", icon: "calendar-clock" },
  { label: "Resumen", icon: "text-box" },
]

const offerTypes = [
  { id: "discount" as const, label: "Descuento", icon: "percent", desc: "Porcentaje o monto fijo de descuento" },
  { id: "combo" as const, label: "Combo", icon: "package-variant", desc: "Paquete de productos a precio especial" },
]

export function CreateOfferModal({ onClose, onCreate }: CreateOfferModalProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "" as "discount" | "combo" | "",
    discount_percent: "",
    discount_amount_usd: "",
    combo_price_usd: "",
    combo_price_cup: "",
    start_date: "",
    end_date: "",
  })

  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const fetchProducts = useCallback(async (search?: string) => {
    try {
      setProductsLoading(true)
      const result = await getProducts(
        { status: "active", search: search || undefined },
        1,
        50
      )
      setProducts(result.data)
    } catch (err) {
      sileo.error({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudieron cargar los productos",
      })
    } finally {
      setProductsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (step === 2) {
      fetchProducts(productSearch)
    }
  }, [step, productSearch, fetchProducts])

  const toggleProduct = (id: string) => {
    if (formData.type === "discount") {
      setSelectedProductIds((prev) => (prev.includes(id) ? [] : [id]))
    } else {
      setSelectedProductIds((prev) =>
        prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
      )
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const payload: CreateOfferInput = {
        title: formData.title,
        description: formData.description || undefined,
        type: formData.type as "discount" | "combo",
        product_ids: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      }

      if (formData.type === "discount") {
        if (formData.discount_percent) payload.discount_percent = parseFloat(formData.discount_percent)
        if (formData.discount_amount_usd) payload.discount_amount_usd = parseFloat(formData.discount_amount_usd)
      }

      if (formData.type === "combo") {
        if (formData.combo_price_usd) payload.combo_price_usd = parseFloat(formData.combo_price_usd)
        if (formData.combo_price_cup) payload.combo_price_cup = parseFloat(formData.combo_price_cup)
      }

      payload.start_date = formData.start_date || new Date().toISOString()
      if (formData.end_date) payload.end_date = formData.end_date

      await onCreate(payload)
    } catch (err) {
      sileo.error({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo crear la oferta",
      })
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 0) return !!formData.type
    if (step === 1) return !!formData.title
    if (step === 2) {
      if (formData.type === "discount") return selectedProductIds.length === 1
      if (formData.type === "combo") return selectedProductIds.length >= 2
      return true
    }
    return true
  }

  const getStepError = () => {
    if (step === 2) {
      if (formData.type === "discount" && selectedProductIds.length > 1) {
        return "Una oferta de descuento solo puede tener 1 producto"
      }
      if (formData.type === "combo" && selectedProductIds.length === 1) {
        return "Una oferta combo necesita al menos 2 productos"
      }
    }
    return null
  }

  const filteredProducts = products

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-[600px] max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h2 className="text-base font-semibold text-on-surface">Crear Nueva Oferta</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Paso {step + 1} de {steps.length}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <Icon name="close"/>
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
          {/* Step 1: Type Selection */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Tipo de Oferta</h3>
              <div className="grid grid-cols-2 gap-3">
                {offerTypes.map((ot) => (
                  <button
                    key={ot.id}
                    onClick={() => setFormData({ ...formData, type: ot.id })}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl transition-all border text-center",
                      formData.type === ot.id
                        ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                        : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      formData.type === ot.id ? "bg-primary/20" : "bg-surface-container-high"
                    )}>
                      <Icon name={ot.icon} className={cn(
                        "text-xl",
                        formData.type === ot.id ? "text-primary" : "text-on-surface-variant"
                      )} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{ot.label}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{ot.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Detail */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información de la Oferta</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Ej: Summer Streaming Sale"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                    placeholder="Descripción de la campaña..."
                  />
                </div>

                {formData.type === "discount" && (
                  <>
                    <div>
                      <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descuento Porcentual (%)</label>
                      <input
                        type="number"
                        value={formData.discount_percent}
                        onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value, discount_amount_usd: "" })}
                        className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder="20"
                        min="0"
                        max="100"
                      />
                      <p className="mt-1 text-[10px] text-on-surface-variant">Ingresa UNO de los dos: porcentaje o monto fijo</p>
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descuento en USD ($)</label>
                      <input
                        type="number"
                        value={formData.discount_amount_usd}
                        onChange={(e) => setFormData({ ...formData, discount_amount_usd: e.target.value, discount_percent: "" })}
                        className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder="5"
                        min="0"
                      />
                    </div>
                  </>
                )}

                {formData.type === "combo" && (
                  <>
                    <div>
                      <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Combo (USD) *</label>
                      <input
                        type="number"
                        value={formData.combo_price_usd}
                        onChange={(e) => setFormData({ ...formData, combo_price_usd: e.target.value })}
                        className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder="15.99"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Combo (CUP)</label>
                      <input
                        type="number"
                        value={formData.combo_price_cup}
                        onChange={(e) => setFormData({ ...formData, combo_price_cup: e.target.value })}
                        className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        placeholder="Opcional"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Products */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-on-surface">
                  {formData.type === "discount" ? "Seleccionar 1 Producto" : "Seleccionar Productos (mín. 2)"}
                </h3>
                <span className="text-[10px] text-on-surface-variant">
                  {selectedProductIds.length} seleccionado{selectedProductIds.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Icon name="magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  placeholder="Buscar productos..."
                />
              </div>

              {/* Error hint */}
              {getStepError() && (
                <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-[11px] text-red-400">{getStepError()}</p>
                </div>
              )}

              {/* Product list */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Icon name="loading" className="text-lg text-on-surface-variant animate-spin" />
                    <span className="ml-2 text-xs text-on-surface-variant">Cargando productos...</span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="package-variant" className="text-3xl text-on-surface-variant/30 mb-2" />
                    <p className="text-xs text-on-surface-variant">No se encontraron productos</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const isSelected = selectedProductIds.includes(product.id)
                    return (
                      <button
                        key={product.id}
                        onClick={() => toggleProduct(product.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                          isSelected
                            ? "bg-primary/10 border-primary/30"
                            : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-white/10 bg-surface-container-high"
                        )}>
                          {isSelected && <Icon name="check" className="text-[10px] text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-on-surface truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: `${product.platform_color}20`, color: product.platform_color }}
                            >
                              {product.platform_name}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              ${product.price_sale}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-on-surface-variant">
                            {product.available_units} disp.
                          </p>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Vigencia</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Inicio</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <p className="mt-1 text-[10px] text-on-surface-variant">Opcional. Si se deja vacío, la oferta está vigente desde la creación.</p>
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Fin</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <p className="mt-1 text-[10px] text-on-surface-variant">Opcional. Si se deja vacío, la oferta no expira.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Resumen de la Oferta</h3>
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Título</span>
                  <span className="text-xs font-medium text-on-surface">{formData.title || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Tipo</span>
                  <span className="text-xs font-medium text-on-surface">{formData.type === "discount" ? "Descuento" : "Combo"}</span>
                </div>
                {formData.description && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descripción</span>
                    <span className="text-xs font-medium text-on-surface max-w-[200px] truncate">{formData.description}</span>
                  </div>
                )}
                <div className="border-t border-white/5 pt-3" />
                {formData.type === "discount" && (
                  <>
                    {formData.discount_percent && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descuento</span>
                        <span className="text-sm font-bold text-primary">{formData.discount_percent}%</span>
                      </div>
                    )}
                    {formData.discount_amount_usd && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descuento</span>
                        <span className="text-sm font-bold text-primary">${formData.discount_amount_usd} OFF</span>
                      </div>
                    )}
                  </>
                )}
                {formData.type === "combo" && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Combo</span>
                    <span className="text-sm font-bold text-primary">${formData.combo_price_usd || "—"}</span>
                  </div>
                )}
                <div className="border-t border-white/5 pt-3" />
                {/* Selected products */}
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Productos ({selectedProductIds.length})
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {products
                      .filter((p) => selectedProductIds.includes(p.id))
                      .map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                              style={{ backgroundColor: `${p.platform_color}20`, color: p.platform_color }}
                            >
                              {p.platform_name}
                            </span>
                            <span className="text-xs text-on-surface truncate">{p.name}</span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant shrink-0 ml-2">${p.price_sale}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Inicio</span>
                  <span className="text-xs font-medium text-on-surface">
                    {formData.start_date ? new Date(formData.start_date).toLocaleDateString("es-ES") : "Desde creación"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fin</span>
                  <span className="text-xs font-medium text-on-surface">
                    {formData.end_date ? new Date(formData.end_date).toLocaleDateString("es-ES") : "Sin expiración"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <Icon name="information" className="text-sm text-primary" />
                  <p className="text-[11px] text-primary">La oferta se creará con estado "Activa" y los productos seleccionados.</p>
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
                  Crear Oferta
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
