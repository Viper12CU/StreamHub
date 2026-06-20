"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import { getProducts, type ProductWithDetails } from "@/lib/api/products"
import { createInventoryItem, clearInventoryCache, type AssetType } from "@/lib/api/inventory"
import { sileo } from "sileo"

interface CreateAssetModalProps {
  onClose: () => void
  onCreated?: () => void
}

const steps = [
  { label: "Tipo", icon: "tag" },
  { label: "Detalle", icon: "information" },
  { label: "Resumen", icon: "text-box" },
]

const assetTypes = [
  { id: "account" as AssetType, label: "Cuenta Completa", icon: "account", description: "Acceso completo a la plataforma" },
  { id: "profile" as AssetType, label: "Perfil Compartido", icon: "account-group", description: "Perfil dentro de una cuenta familiar" },
  { id: "code" as AssetType, label: "Código de Activación", icon: "key", description: "Código de un solo uso" },
  { id: "package" as AssetType, label: "Paquete de Suscripción", icon: "package", description: "Licencia o paquete prepagado" },
]

export function CreateAssetModal({ onClose, onCreated }: CreateAssetModalProps) {
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState<AssetType>("account")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)

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

  const canProceed = () => {
    if (step === 0) return !!selectedProductId
    return true
  }

  const handleSubmit = async () => {
    if (!selectedProductId) {
      sileo.error({ title: "Error", description: "Selecciona un producto" })
      return
    }

    setLoading(true)
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
            <h2 className="text-base font-semibold text-on-surface">Agregar Inventario</h2>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Paso {step + 1} de {steps.length}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <Icon name="close" className="text-sm" />
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
                  <Icon name={s.icon} className="text-[10px]" />
                </div>
                <span className={cn(
                  "text-[9px] font-semibold hidden sm:block",
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
          {/* Step 1: Tipo */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Tipo de Activo</h3>
              <div className="grid grid-cols-2 gap-3">
                {assetTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl transition-all border text-center",
                      selectedType === type.id
                        ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                        : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      selectedType === type.id ? "bg-primary/20" : "bg-surface-container-high"
                    )}>
                      <Icon name={type.icon} className={cn(
                        "text-xl",
                        selectedType === type.id ? "text-primary" : "text-on-surface-variant"
                      )} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">{type.label}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Producto *</label>
                <div className="relative mt-1">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <Icon name="unfold-more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Detalle */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información del Activo</h3>

              {selectedType === "account" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cuenta@ejemplo.com" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email de Recuperación</label>
                    <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="recovery@ejemplo.com" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              {selectedType === "profile" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Cuenta Padre</label>
                    <input type="text" value={parentAccount} onChange={(e) => setParentAccount(e.target.value)} placeholder="Email de la cuenta principal" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre del Perfil</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Ej: Perfil María" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">PIN</label>
                    <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="1234" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              {selectedType === "code" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Código de Activación</label>
                    <input type="text" value={activationCode} onChange={(e) => setActivationCode(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              {selectedType === "package" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Clave de Licencia</label>
                    <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX" className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface font-mono placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Expiración</label>
                <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas..." className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none" />
              </div>
            </div>
          )}

          {/* Step 3: Resumen */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Resumen del Activo</h3>
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Tipo de Activo</span>
                  <span className="text-xs font-medium text-on-surface">{assetTypes.find(t => t.id === selectedType)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Producto</span>
                  <span className="text-xs font-medium text-on-surface">{selectedProduct?.name || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Plataforma</span>
                  <span className="text-xs font-medium text-on-surface">{selectedProduct?.platform_name || "N/A"}</span>
                </div>
                {expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Expira</span>
                    <span className="text-xs font-medium text-on-surface">{expiresAt}</span>
                  </div>
                )}
                <div className="border-t border-white/5 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</span>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-full">Disponible</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <Icon name="information" className="text-sm text-primary" />
                  <p className="text-[11px] text-primary">El activo será creado con estado "Disponible" y estará listo para asignación inmediata.</p>
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
                  Crear Activo
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
