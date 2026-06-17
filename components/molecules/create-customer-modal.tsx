"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"
import { ButtonSpinner } from "@/components/atoms/button-spinner"
import type { CustomerStatus } from "@/lib/api/customers"

export interface CreateCustomerFormData {
  name: string
  email: string
  password: string
  phone: string
  country: string
  status: CustomerStatus
  notes: string
}

interface CreateCustomerModalProps {
  onClose: () => void
  onCreate: (data: CreateCustomerFormData) => Promise<void>
}

const steps = [
  { label: "Información", icon: "account" },
  { label: "Cuenta", icon: "cog" },
  { label: "Resumen", icon: "text-box" },
]

export function CreateCustomerModal({ onClose, onCreate }: CreateCustomerModalProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateCustomerFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    status: "active",
    notes: "",
  })

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const canProceed = step === 0
    ? formData.name.trim().length >= 2 && formData.email.includes("@")
    : step === 1
      ? formData.password.length >= 8
      : true

  const handleCreate = async () => {
    try {
      setCreating(true)
      setError(null)
      await onCreate(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cliente")
    } finally {
      setCreating(false)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-[520px] max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h2 className="text-base font-semibold text-on-surface">Crear Cliente</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Paso {step + 1} de {steps.length}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <Icon name="close" className="text-sm" />
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
                  <Icon name={s.icon} className="text-sm" />
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

        {/* Error */}
        {error && (
          <div className="mx-5 mt-3 p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2">
            <Icon name="alert-circle" className="text-sm text-error" />
            <p className="text-xs text-error">{error}</p>
          </div>
        )}

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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Nombre del cliente"
                  />
                  {formData.name.length > 0 && formData.name.length < 2 && (
                    <p className="text-[10px] text-error mt-1">Mínimo 2 caracteres</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="+53 555 12345"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">País</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="Cuba"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Cuenta y Estado</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Contraseña *</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Mínimo 8 caracteres"
                  />
                  {formData.password.length > 0 && formData.password.length < 8 && (
                    <p className="text-[10px] text-error mt-1">Mínimo 8 caracteres</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado del Cliente</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { value: "active" as const, label: "Activo", color: "bg-green-500" },
                      { value: "vip" as const, label: "VIP", color: "bg-amber-500" },
                      { value: "suspended" as const, label: "Suspendido", color: "bg-error" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFormData({ ...formData, status: option.value })}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-semibold transition-all border",
                          formData.status === option.value
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                    placeholder="Notas privadas sobre el cliente..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Resumen del Cliente</h3>
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre</span>
                  <span className="text-xs font-medium text-on-surface">{formData.name || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email</span>
                  <span className="text-xs font-medium text-on-surface">{formData.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Teléfono</span>
                  <span className="text-xs font-medium text-on-surface">{formData.phone || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">País</span>
                  <span className="text-xs font-medium text-on-surface">{formData.country || "—"}</span>
                </div>
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</span>
                  <span className="text-xs font-semibold text-primary capitalize">{formData.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Contraseña</span>
                  <span className="text-xs text-on-surface">{"*".repeat(formData.password.length)}</span>
                </div>
                {formData.notes && (
                  <>
                    <div className="border-t border-white/5 pt-3" />
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas</span>
                      <p className="text-xs text-on-surface mt-1">{formData.notes}</p>
                    </div>
                  </>
                )}
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
            {step > 0 ? <Icon name="arrow-left" className="text-sm" /> : <Icon name="close" className="text-sm" />}
            {step > 0 ? "Anterior" : "Cancelar"}
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <Icon name="arrow-right" className="text-sm" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {creating ? <ButtonSpinner /> : <Icon name="check" className="text-sm" />}
              {creating ? "Creando..." : "Crear Cliente"}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
