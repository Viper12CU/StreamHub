"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { getInventoryItem, deleteInventoryItem, updateInventoryItem, clearInventoryCache, type InventoryWithDetails } from "@/lib/api/inventory"
import { sileo } from "sileo"

interface AssetDetailDrawerProps {
  assetId: string
  onClose: () => void
  onRefresh?: () => void
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "neutral" | "error" }> = {
  available: { label: "Disponible", variant: "success" },
  reserved: { label: "Reservado", variant: "warning" },
  assigned: { label: "Asignado", variant: "neutral" },
  expired: { label: "Expirado", variant: "error" },
  suspended: { label: "Suspendido", variant: "error" },
}

const assetTypeLabels: Record<string, string> = {
  account: "Cuenta Completa",
  profile: "Perfil Compartido",
  code: "Código de Activación",
  package: "Paquete de Suscripción",
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "N/A"
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
  } catch {
    return "N/A"
  }
}

export function AssetDetailDrawer({ assetId, onClose, onRefresh }: AssetDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [item, setItem] = useState<InventoryWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    setLoading(true)
    getInventoryItem(assetId)
      .then(setItem)
      .catch(() => sileo.error({ title: "Error", description: "No se pudo cargar el activo" }))
      .finally(() => setLoading(false))
  }, [assetId])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async () => {
    try {
      await deleteInventoryItem(assetId)
      sileo.success({ title: "Eliminado", description: "Activo eliminado correctamente" })
      clearInventoryCache()
      onRefresh?.()
      onClose()
    } catch {
      sileo.error({ title: "Error", description: "No se pudo eliminar el activo" })
    }
  }

  const handleSuspend = async () => {
    if (!item) return
    try {
      await updateInventoryItem(assetId, { status: "suspended" })
      sileo.success({ title: "Suspendido", description: "Activo suspendido correctamente" })
      setItem({ ...item, status: "suspended" })
      onRefresh?.()
    } catch {
      sileo.error({ title: "Error", description: "No se pudo suspender el activo" })
    }
  }

  const meta = item?.metadata
  const statusStyle = statusMap[item?.status || "available"]

  const drawerContent = (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="fingerprint" className="text-primary text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">Detalle del Activo</h2>
              <p className="text-[10px] text-on-surface-variant">{loading ? "Cargando..." : item?.id.slice(0, 8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <Icon name="close" className="text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-5 space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : item ? (
            <div className="p-5 space-y-5">
              {/* Asset Info */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="information" className="text-sm text-primary" />
                  Información del Activo
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "ID", value: item.id.slice(0, 8) },
                    { label: "Plataforma", value: item.platform_name },
                    { label: "Producto", value: item.product_name },
                    { label: "Tipo", value: assetTypeLabels[meta?.asset_type] || meta?.asset_type || "N/A" },
                  ].map((field) => (
                    <div key={field.label} className="p-2.5 bg-surface-container-low rounded-lg">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{field.label}</p>
                      <p className="text-xs font-medium text-on-surface mt-0.5">{field.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                  <div className="mt-1">
                    <StatusBadge status={statusStyle?.label || item.status} variant={statusStyle?.variant || "neutral"} />
                  </div>
                </div>
              </section>

              {/* Credentials */}
              {(meta?.email || meta?.activation_code || meta?.license_key || meta?.profile_name) && (
                <section className="glass rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <Icon name="lock" className="text-sm text-primary" />
                    Credenciales
                  </h4>
                  <div className="space-y-3">
                    {meta.email && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email</p>
                          <button onClick={() => handleCopy(meta.email!, "email")} className="text-[10px] text-primary hover:underline">
                            {copied === "email" ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-on-surface mt-0.5">{meta.email}</p>
                      </div>
                    )}
                    {meta.password && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Contraseña</p>
                          <div className="flex gap-2">
                            <button onClick={() => setShowPassword(!showPassword)} className="text-[10px] text-primary hover:underline">
                              {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                            <button onClick={() => handleCopy(meta.password!, "password")} className="text-[10px] text-primary hover:underline">
                              {copied === "password" ? "Copiado" : "Copiar"}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-mono text-on-surface mt-0.5">
                          {showPassword ? meta.password : "••••••••••••"}
                        </p>
                      </div>
                    )}
                    {meta.recovery_email && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email de Recuperación</p>
                          <button onClick={() => handleCopy(meta.recovery_email!, "recovery")} className="text-[10px] text-primary hover:underline">
                            {copied === "recovery" ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-on-surface mt-0.5">{meta.recovery_email}</p>
                      </div>
                    )}
                    {meta.profile_name && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre del Perfil</p>
                        <p className="text-xs font-mono text-on-surface mt-0.5">{meta.profile_name}</p>
                      </div>
                    )}
                    {meta.activation_code && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Código de Activación</p>
                          <button onClick={() => handleCopy(meta.activation_code!, "code")} className="text-[10px] text-primary hover:underline">
                            {copied === "code" ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-on-surface mt-0.5">{meta.activation_code}</p>
                      </div>
                    )}
                    {meta.license_key && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Clave de Licencia</p>
                          <button onClick={() => handleCopy(meta.license_key!, "license")} className="text-[10px] text-primary hover:underline">
                            {copied === "license" ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-on-surface mt-0.5">{meta.license_key}</p>
                      </div>
                    )}
                    {meta.notes && (
                      <div className="p-2.5 bg-surface-container-low rounded-lg">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas</p>
                        <p className="text-xs text-on-surface mt-0.5">{meta.notes}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Usage Info */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="clock-outline" className="text-sm text-primary" />
                  Información de Uso
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                    <p className="text-sm font-bold text-on-surface mt-1">{statusStyle?.label || item.status}</p>
                  </div>
                  <div className="text-center p-3 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Expira</p>
                    <p className="text-sm font-bold text-on-surface mt-1">{formatDate(item.expires_at)}</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-[10px] text-primary uppercase tracking-wider">Días</p>
                    <p className="text-sm font-bold text-primary mt-1">{item.days_remaining ?? "N/A"}</p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Icon name="alert-circle" className="text-4xl text-on-surface-variant/30" />
              <p className="text-sm text-on-surface-variant mt-2">Activo no encontrado</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {item && (
          <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleSuspend}
                disabled={item.status === "suspended"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20 disabled:opacity-40"
              >
                <Icon name="block" className="text-sm" />
                Suspender
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20"
              >
                <Icon name="delete" className="text-sm" />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
