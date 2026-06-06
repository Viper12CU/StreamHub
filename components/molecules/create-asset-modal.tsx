"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface CreateAssetModalProps {
  onClose: () => void
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

const assetTypes = [
  { id: "account", label: "Cuenta Completa", icon: "person", description: "Acceso completo a la plataforma" },
  { id: "profile", label: "Perfil Compartido", icon: "group", description: "Perfil dentro de una cuenta familiar" },
  { id: "code", label: "Código de Activación", icon: "vpn_key", description: "Código de un solo uso" },
  { id: "package", label: "Paquete de Suscripción", icon: "inventory", description: "Licencia o paquete prepagado" },
]

const products = [
  "Netflix Premium 4 Screens",
  "Netflix Standard 2 Screens",
  "Spotify Family",
  "Spotify Individual",
  "Disney+ Premium",
  "YouTube Premium",
  "HBO Max Ultra",
  "Crunchyroll Mega",
  "IPTV Premium",
  "Disney+ + ESPN",
]

export function CreateAssetModal({ onClose }: CreateAssetModalProps) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState("account")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">add_box</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Agregar Inventario</h2>
              <p className="text-[11px] text-on-surface-variant">Paso {step} de 3</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 px-6 pt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                s < step ? "bg-primary text-white" :
                s === step ? "bg-primary text-white ring-4 ring-primary/20" :
                "bg-surface-container-high text-on-surface-variant"
              )}>
                {s < step ? <span className="material-symbols-outlined text-sm">check</span> : s}
              </div>
              {s < 3 && <div className={cn("flex-1 h-0.5 rounded-full", s < step ? "bg-primary" : "bg-surface-container-high")} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Tipo de Activo</h3>
                <p className="text-[11px] text-on-surface-variant">Selecciona el tipo de activo a crear</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {assetTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedType === type.id
                        ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                        : "bg-surface-container-low border-white/5 hover:bg-surface-container-high hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn("material-symbols-outlined text-sm", selectedType === type.id ? "text-primary" : "text-on-surface-variant")}>
                        {type.icon}
                      </span>
                      <span className={cn("text-xs font-semibold", selectedType === type.id ? "text-primary" : "text-on-surface")}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">{type.description}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-on-surface-variant">Producto *</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer">
                      <option value="">Seleccionar producto...</option>
                      {products.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">unfold_more</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Información del Activo</h3>
                <p className="text-[11px] text-on-surface-variant">
                  {selectedType === "account" && "Datos de acceso a la cuenta"}
                  {selectedType === "profile" && "Datos del perfil compartido"}
                  {selectedType === "code" && "Datos del código de activación"}
                  {selectedType === "package" && "Datos del paquete de suscripción"}
                </p>
              </div>

              {selectedType === "account" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Email *</label>
                    <input type="email" placeholder="cuenta@ejemplo.com" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Contraseña *</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Email de Recuperación</label>
                    <input type="email" placeholder="recovery@ejemplo.com" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Notas</label>
                    <textarea rows={2} placeholder="Notas internas..." className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none" />
                  </div>
                </div>
              )}

              {selectedType === "profile" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Cuenta Padre *</label>
                    <input type="text" placeholder="Email de la cuenta principal" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Nombre del Perfil *</label>
                    <input type="text" placeholder="Ej: Perfil María" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">PIN</label>
                    <input type="text" placeholder="1234" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Notas</label>
                    <textarea rows={2} placeholder="Notas internas..." className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none" />
                  </div>
                </div>
              )}

              {selectedType === "code" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Código de Activación *</label>
                    <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Fecha de Expiración *</label>
                    <input type="date" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Notas</label>
                    <textarea rows={2} placeholder="Notas internas..." className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none" />
                  </div>
                </div>
              )}

              {selectedType === "package" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Clave de Licencia *</label>
                    <input type="text" placeholder="XXXXX-XXXXX-XXXXX" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Fecha de Expiración *</label>
                    <input type="date" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Notas</label>
                    <textarea rows={2} placeholder="Notas internas..." className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none" />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Resumen</h3>
                <p className="text-[11px] text-on-surface-variant">Revisa los datos antes de crear</p>
              </div>
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Tipo de Activo</span>
                  <span className="text-xs font-semibold text-on-surface">{assetTypes.find(t => t.id === selectedType)?.label}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Producto</span>
                  <span className="text-xs text-on-surface">Netflix Premium 4 Screens</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Plataforma</span>
                  <span className="text-xs text-on-surface">Netflix</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs text-on-surface-variant">Estado</span>
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-full">Disponible</span>
                </div>
              </div>
              <div className="p-4 bg-primary/[0.08] border border-primary/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                <p className="text-xs text-on-surface">El activo será creado con estado "Disponible" y estará listo para asignación inmediata.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/5 bg-surface-container-lowest/50">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">{step > 1 ? "arrow_back" : "close"}</span>
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Siguiente
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">check</span>
              Crear Activo
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
