"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { getProducts, type ProductWithDetails } from "@/lib/api/products"
import { createInventoryItem, clearInventoryCache, type AssetType } from "@/lib/api/inventory"
import { sileo } from "sileo"

interface CreateAssetModalProps {
  onClose: () => void
  onCreated?: () => void
}

const assetTypes = [
  { id: "account" as AssetType, label: "Cuenta Completa", icon: "person", description: "Acceso completo a la plataforma" },
  { id: "profile" as AssetType, label: "Perfil Compartido", icon: "group", description: "Perfil dentro de una cuenta familiar" },
  { id: "code" as AssetType, label: "Código de Activación", icon: "vpn_key", description: "Código de un solo uso" },
  { id: "package" as AssetType, label: "Paquete de Suscripción", icon: "inventory", description: "Licencia o paquete prepagado" },
]

export function CreateAssetModal({ onClose, onCreated }: CreateAssetModalProps) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<AssetType>("account")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [profileName, setProfileName] = useState("")
  const [parentAccount, setParentAccount] = useState("")
  const [pin, setPin] = useState("")
  const [activationCode, setActivationCode] = useState("")
  const [licenseKey, setLicenseKey] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    getProducts({ limit: 100 }).then((res) => setProducts(res.data)).catch(() => {})
    return () => { document.body.style.overflow = "" }
  }, [])

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleCreate = async () => {
    if (!selectedProductId) {
      sileo.error({ title: "Error", description: "Selecciona un producto" })
      return
    }

    setSubmitting(true)
    try {
      const metadata: Record<string, unknown> = { asset_type: selectedType }

      if (selectedType === "account") {
        if (email) metadata.email = email
        if (password) metadata.password = password
        if (recoveryEmail) metadata.recovery_email = recoveryEmail
      } else if (selectedType === "profile") {
        if (parentAccount) metadata.parent_account = parentAccount
        if (profileName) metadata.profile_name = profileName
        if (pin) metadata.pin = pin
      } else if (selectedType === "code") {
        if (activationCode) metadata.activation_code = activationCode
      } else if (selectedType === "package") {
        if (licenseKey) metadata.license_key = licenseKey
      }
      if (notes) metadata.notes = notes

      await createInventoryItem({
        product_id: selectedProductId,
        status: "available",
        expires_at: expiresAt || undefined,
        metadata: metadata as any,
      })

      sileo.success({ title: "Activo creado", description: "El activo fue agregado al inventario" })
      clearInventoryCache()
      onCreated?.()
      onClose()
    } catch {
      sileo.error({ title: "Error", description: "No se pudo crear el activo" })
    } finally {
      setSubmitting(false)
    }
  }

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
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                s < step ? "bg-primary text-white" :
                s === step ? "bg-primary text-white ring-4 ring-primary/20" :
                "bg-surface-container-high text-on-surface-variant"
              }`}>
                {s < step ? <span className="material-symbols-outlined text-sm">check</span> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full ${s < step ? "bg-primary" : "bg-surface-container-high"}`} />}
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
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedType === type.id
                        ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                        : "bg-surface-container-low border-white/5 hover:bg-surface-container-high hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`material-symbols-outlined text-sm ${selectedType === type.id ? "text-primary" : "text-on-surface-variant"}`}>
                        {type.icon}
                      </span>
                      <span className={`text-xs font-semibold ${selectedType === type.id ? "text-primary" : "text-on-surface"}`}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">{type.description}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-on-surface-variant">Producto *</label>
                <div className="relative">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">unfold_more</span>
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
                    <label className="text-[11px] font-medium text-on-surface-variant">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cuenta@ejemplo.com" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Email de Recuperación</label>
                    <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="recovery@ejemplo.com" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              {selectedType === "profile" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Cuenta Padre</label>
                    <input type="text" value={parentAccount} onChange={(e) => setParentAccount(e.target.value)} placeholder="Email de la cuenta principal" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Nombre del Perfil</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Ej: Perfil María" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">PIN</label>
                    <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="1234" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              {selectedType === "code" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Código de Activación</label>
                    <input type="text" value={activationCode} onChange={(e) => setActivationCode(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              {selectedType === "package" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-on-surface-variant">Clave de Licencia</label>
                    <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX" className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-on-surface-variant">Fecha de Expiración</label>
                <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-on-surface-variant">Notas</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas..." className="w-full px-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none" />
              </div>
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
                  <span className="text-xs text-on-surface">{selectedProduct?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-on-surface-variant">Plataforma</span>
                  <span className="text-xs text-on-surface">{selectedProduct?.platform_name || "N/A"}</span>
                </div>
                {expiresAt && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant">Expira</span>
                    <span className="text-xs text-on-surface">{expiresAt}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-xs text-on-surface-variant">Estado</span>
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-full">Disponible</span>
                </div>
              </div>
              <div className="p-4 bg-primary/[0.08] border border-primary/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                <p className="text-xs text-on-surface">El activo será creado con estado &quot;Disponible&quot; y estará listo para asignación inmediata.</p>
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
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">{submitting ? "hourglass_empty" : "check"}</span>
              {submitting ? "Creando..." : "Crear Activo"}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
