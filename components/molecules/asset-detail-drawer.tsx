"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"

interface AssetDetailDrawerProps {
  assetId: string
  onClose: () => void
}

const assetData = {
  id: "INV-000452",
  platform: "Netflix",
  product: "Netflix Premium 4 Screens",
  type: "Cuenta Completa",
  status: "available",
  email: "netflixpremium2024@gmail.com",
  password: "N3tfl!x_S3cur3_P@ss",
  recoveryEmail: "recovery@gmail.com",
  notes: "Cuenta familiar premium con 4 pantallas 4K. Sin historial de problemas.",
  expirationDate: "2025-03-15",
  daysRemaining: 120,
  lastUpdated: "Hace 2 horas",
  createdAt: "2024-01-15",
}

const assignmentHistory = [
  { action: "Creado", admin: "System", timestamp: "15 Ene 2024, 10:30 AM", icon: "add_circle", color: "text-green-400" },
  { action: "Verificado", admin: "Admin Principal", timestamp: "15 Ene 2024, 11:45 AM", icon: "check_circle", color: "text-primary" },
  { action: "Añadido al catálogo", admin: "Admin Principal", timestamp: "15 Ene 2024, 12:00 PM", icon: "inventory_2", color: "text-secondary" },
]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export function AssetDetailDrawer({ assetId, onClose }: AssetDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const drawerContent = (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">fingerprint</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">Detalle del Activo</h2>
              <p className="text-[10px] text-on-surface-variant">{assetData.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            {/* Asset Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">info</span>
                Información del Activo
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ID", value: assetData.id },
                  { label: "Plataforma", value: assetData.platform },
                  { label: "Producto", value: assetData.product },
                  { label: "Tipo", value: assetData.type },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                <div className="mt-1">
                  <StatusBadge status="Disponible" variant="success" />
                </div>
              </div>
            </section>

            {/* Credentials */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">lock</span>
                Credenciales
              </h4>
              <div className="space-y-3">
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email</p>
                    <button onClick={() => handleCopy(assetData.email, "email")} className="text-[10px] text-primary hover:underline">
                      {copied === "email" ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-on-surface mt-0.5">{assetData.email}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Contraseña</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowPassword(!showPassword)} className="text-[10px] text-primary hover:underline">
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                      <button onClick={() => handleCopy(assetData.password, "password")} className="text-[10px] text-primary hover:underline">
                        {copied === "password" ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-on-surface mt-0.5">
                    {showPassword ? assetData.password : "••••••••••••"}
                  </p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Email de Recuperación</p>
                    <button onClick={() => handleCopy(assetData.recoveryEmail, "recovery")} className="text-[10px] text-primary hover:underline">
                      {copied === "recovery" ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-on-surface mt-0.5">{assetData.recoveryEmail}</p>
                </div>
                {assetData.notes && (
                  <div className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas</p>
                    <p className="text-xs text-on-surface mt-0.5">{assetData.notes}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Assignment History */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">history</span>
                Historial de Asignación
              </h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-4">
                  {assignmentHistory.map((event, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <div className={cn("w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center z-10", event.color)}>
                        <span className="material-symbols-outlined text-sm">{event.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-on-surface">{event.action}</p>
                        <p className="text-[10px] text-on-surface-variant">{event.admin} • {event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Usage Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                Información de Uso
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-[10px] text-green-400 uppercase tracking-wider">Estado</p>
                  <p className="text-sm font-bold text-green-400 mt-1">Activo</p>
                </div>
                <div className="text-center p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Expira</p>
                  <p className="text-sm font-bold text-on-surface mt-1">{assetData.expirationDate}</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-[10px] text-primary uppercase tracking-wider">Días</p>
                  <p className="text-sm font-bold text-primary mt-1">{assetData.daysRemaining}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">person_add</span>
              Asignar
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5">
              <span className="material-symbols-outlined text-sm">edit</span>
              Editar
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20">
              <span className="material-symbols-outlined text-sm">block</span>
              Suspender
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20">
              <span className="material-symbols-outlined text-sm">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
