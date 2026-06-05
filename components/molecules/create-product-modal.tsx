"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface CreateProductModalProps {
  onClose: () => void
}

const platforms = ["Netflix", "Disney+", "Spotify", "YouTube Premium", "HBO Max", "Crunchyroll", "IPTV", "Otro"]
const productTypes = ["Cuenta Completa", "Perfil Compartido", "Código de Activación", "Paquete de Suscripción"]

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex-1 flex items-center gap-2">
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200",
            s < currentStep ? "bg-primary text-on-primary" :
            s === currentStep ? "bg-primary text-on-primary ring-4 ring-primary/20" :
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function CreateProductModal({ onClose }: CreateProductModalProps) {
  const [step, setStep] = useState(1)
  const modalRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">add_box</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Crear Producto</h2>
              <p className="text-[11px] text-on-surface-variant">Paso {step} de 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
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
                  <label className="text-[11px] font-medium text-on-surface-variant">Nombre del Producto *</label>
                  <input
                    type="text"
                    placeholder="Ej: Netflix Premium 4K"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-on-surface-variant">Slug</label>
                  <input
                    type="text"
                    placeholder="netflix-premium-4k"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-on-surface-variant">Descripción *</label>
                  <textarea
                    rows={3}
                    placeholder="Describe las características del producto..."
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Plataforma *</label>
                    <div className="relative">
                      <select className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer">
                        <option value="">Seleccionar...</option>
                        {platforms.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                        unfold_more
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Tipo de Producto *</label>
                    <div className="relative">
                      <select className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer">
                        <option value="">Seleccionar...</option>
                        {productTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                        unfold_more
                      </span>
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
                    <label className="text-[11px] font-medium text-on-surface-variant">Precio de Venta *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Precio de Costo</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Moneda</label>
                    <div className="relative">
                      <select className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="MXN">MXN ($)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                        unfold_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Margin Preview */}
                <div className="p-4 bg-surface-container-low border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                      <span className="text-[11px] font-medium text-on-surface-variant">Margen Estimado</span>
                    </div>
                    <span className="text-lg font-bold text-primary">52%</span>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="w-[52%] h-full bg-primary rounded-full" />
                  </div>
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
                    <label className="text-[11px] font-medium text-on-surface-variant">Stock Inicial *</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Umbral Stock Bajo</label>
                    <input
                      type="number"
                      placeholder="5"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-on-surface-variant">Imágenes del Producto</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                        cloud_upload
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">Arrastra una imagen o haz clic para subir</p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-1">PNG, JPG, WebP hasta 5MB</p>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-on-surface-variant">Estado</label>
                  <div className="flex gap-3">
                    {["Activo", "Borrador", "Archivado"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors"
                      >
                        <input type="radio" name="status" className="accent-primary w-4 h-4" defaultChecked={status === "Activo"} />
                        <span className="text-xs text-on-surface">{status}</span>
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
                    <img
                      src="https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=60&h=60&fit=crop"
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Netflix Premium 4K</p>
                      <p className="text-[11px] text-on-surface-variant">Netflix • Cuenta Completa</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Precio de Venta</span>
                    <span className="text-sm font-semibold text-on-surface">$24.99</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Precio de Costo</span>
                    <span className="text-sm text-on-surface">$12.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Margen</span>
                    <span className="text-sm font-semibold text-primary">52%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Stock Inicial</span>
                    <span className="text-sm text-on-surface">50 unidades</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-on-surface-variant">Estado</span>
                    <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-full">Activo</span>
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
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {step > 1 ? "arrow_back" : "close"}
            </span>
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>

          <div className="flex gap-2">
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Siguiente
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">check</span>
                Crear Producto
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
