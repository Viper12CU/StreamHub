"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"

interface CreateOrderModalProps {
  onClose: () => void
}

const steps = [
  { label: "Cliente", icon: "person" },
  { label: "Producto", icon: "shopping_cart" },
  { label: "Pago", icon: "payment" },
  { label: "Resumen", icon: "summarize" },
]

const platforms = [
  { name: "Netflix", color: "bg-primary-container" },
  { name: "Disney+", color: "bg-tertiary" },
  { name: "Spotify", color: "bg-secondary" },
  { name: "YouTube Premium", color: "bg-[#ff0000]" },
  { name: "HBO Max", color: "bg-[#b829e3]" },
  { name: "Crunchyroll", color: "bg-[#f47521]" },
  { name: "IPTV", color: "bg-amber-500" },
]

const products = [
  { id: "1", name: "Netflix Premium 4 Screens", platform: "Netflix", price: 8.99 },
  { id: "2", name: "Netflix Standard 2 Screens", platform: "Netflix", price: 5.99 },
  { id: "3", name: "Disney+ Premium", platform: "Disney+", price: 7.99 },
  { id: "4", name: "Spotify Family", platform: "Spotify", price: 14.99 },
  { id: "5", name: "Spotify Individual", platform: "Spotify", price: 4.99 },
  { id: "6", name: "YouTube Premium", platform: "YouTube Premium", price: 9.99 },
  { id: "7", name: "HBO Max Ultra", platform: "HBO Max", price: 11.99 },
  { id: "8", name: "Crunchyroll Mega", platform: "Crunchyroll", price: 6.99 },
  { id: "9", name: "IPTV Premium", platform: "IPTV", price: 12.99 },
]

export function CreateOrderModal({ onClose }: CreateOrderModalProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    product: "",
    platform: "",
    quantity: 1,
    paymentMethod: "",
    paymentReference: "",
    notes: "",
  })

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const selectedProduct = products.find((p) => p.id === formData.product)
  const total = selectedProduct ? selectedProduct.price * formData.quantity : 0

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-[560px] max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h2 className="text-base font-semibold text-on-surface">Crear Nueva Orden</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Paso {step + 1} de {steps.length}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0",
                  i <= step
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface-container-high text-on-surface-variant"
                )}>
                  <span className="material-symbols-outlined text-sm">{s.icon}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-semibold hidden sm:block",
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
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información del Cliente</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="+53 555 12345"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Seleccionar Producto</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Plataforma</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {platforms.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setFormData({ ...formData, platform: p.name, product: "" })}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 border",
                          formData.platform === p.name
                            ? "bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/10"
                            : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                        )}
                      >
                        <span className={cn("w-2 h-2 rounded-full", p.color)} />
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                {formData.platform && (
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Producto</label>
                    <div className="space-y-2 mt-2">
                      {products.filter((p) => p.platform === formData.platform).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setFormData({ ...formData, product: p.id })}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all border",
                            formData.product === p.id
                              ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                              : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                          )}
                        >
                          <span className="text-xs font-medium text-on-surface">{p.name}</span>
                          <span className="text-xs font-semibold text-primary">${p.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {formData.product && (
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Cantidad</label>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                        className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="text-sm font-semibold text-on-surface w-8 text-center">{formData.quantity}</span>
                      <button
                        onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                        className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información de Pago</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Método de Pago *</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Zelle", "Transfermóvil", "MLC"].map((method) => (
                      <button
                        key={method}
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-semibold transition-all border",
                          formData.paymentMethod === method
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                        )}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Referencia de Pago</label>
                  <input
                    type="text"
                    value={formData.paymentReference}
                    onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Número de referencia o comprobante"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                    placeholder="Notas adicionales sobre la orden..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Resumen de la Orden</h3>
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Cliente</span>
                  <span className="text-xs font-medium text-on-surface">{formData.customerName || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email</span>
                  <span className="text-xs font-medium text-on-surface">{formData.customerEmail || "—"}</span>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Producto</span>
                  <span className="text-xs font-medium text-on-surface">{selectedProduct?.name || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Plataforma</span>
                  <span className="text-xs font-medium text-on-surface">{formData.platform || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Cantidad</span>
                  <span className="text-xs font-medium text-on-surface">{formData.quantity}</span>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Método de Pago</span>
                  <span className="text-xs font-medium text-on-surface">{formData.paymentMethod || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Referencia</span>
                  <span className="text-xs font-mono text-on-surface">{formData.paymentReference || "—"}</span>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-on-surface">Total</span>
                  <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">info</span>
                  <p className="text-[11px] text-primary">La orden se creará con estado "Pendiente" y pasará al flujo de verificación de pago.</p>
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
            <span className="material-symbols-outlined text-sm">{step > 0 ? "arrow_back" : "close"}</span>
            {step > 0 ? "Anterior" : "Cancelar"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Siguiente
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              Crear Orden
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
