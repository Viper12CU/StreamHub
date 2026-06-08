"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import {
  updatePlatform,
  type PlatformWithMetrics,
  type PlatformCategory,
  type PlatformStatus,
} from "@/lib/api/platforms"
import { sileo } from "sileo"

interface EditPlatformModalProps {
  platform: PlatformWithMetrics
  onClose: () => void
  onUpdate: () => void
}

const categories: { value: PlatformCategory; label: string }[] = [
  { value: "streaming", label: "Streaming" },
  { value: "musica", label: "Música" },
  { value: "video", label: "Video" },
  { value: "iptv", label: "IPTV" },
  { value: "software", label: "Software" },
  { value: "vpn", label: "VPN" },
  { value: "ai_tools", label: "AI Tools" },
  { value: "gaming", label: "Gaming" },
  { value: "otro", label: "Otro" },
]

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function EditPlatformModal({ platform, onClose, onUpdate }: EditPlatformModalProps) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState<"info" | "description" | "branding" | "display">("info")
  const [formData, setFormData] = useState({
    name: platform.name,
    slug: platform.slug,
    category: platform.category as PlatformCategory,
    description: platform.description || "",
    logoColor: platform.color,
    featured: platform.is_featured,
    showInStore: platform.show_in_store,
    allowPurchases: platform.allow_purchases,
    status: platform.status as PlatformStatus,
  })
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => onClose(), 200)
  }, [onClose])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    setTimeout(() => firstInputRef.current?.focus(), 100)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleClose])

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(platform.name) || prev.slug === "" ? generateSlug(name) : prev.slug,
    }))
  }

  const hasChanges = () => {
    return (
      formData.name !== platform.name ||
      formData.slug !== platform.slug ||
      formData.category !== platform.category ||
      formData.description !== (platform.description || "") ||
      formData.logoColor !== platform.color ||
      formData.featured !== platform.is_featured ||
      formData.showInStore !== platform.show_in_store ||
      formData.allowPurchases !== platform.allow_purchases ||
      formData.status !== platform.status
    )
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.category) return
    try {
      setSubmitting(true)
      await updatePlatform(platform.id, {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description || undefined,
        color: formData.logoColor,
        status: formData.status,
        is_featured: formData.featured,
        show_in_store: formData.showInStore,
        allow_purchases: formData.allowPurchases,
      })
      sileo.success({ title: "Exito", description: "Plataforma actualizada correctamente" })
      onUpdate()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo actualizar la plataforma" })
    } finally {
      setSubmitting(false)
    }
  }

  const sections = [
    { id: "info" as const, label: "Información", icon: "info" },
    { id: "description" as const, label: "Descripción", icon: "description" },
    { id: "branding" as const, label: "Branding", icon: "palette" },
    { id: "display" as const, label: "Display", icon: "visibility" },
  ]

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div
        ref={modalRef}
        className={`relative glass rounded-2xl w-full max-w-[560px] max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-hidden flex flex-col transition-transform duration-200 ${closing ? "scale-95" : "scale-100"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black italic shadow-lg"
              style={{ backgroundColor: formData.logoColor }}
            >
              {formData.name ? formData.name[0].toUpperCase() : "P"}
            </div>
            <div>
              <h2 id="edit-modal-title" className="text-base font-semibold text-on-surface">Editar Plataforma</h2>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{platform.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
                  activeSection === s.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <span className="material-symbols-outlined text-xs">{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          {activeSection === "info" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Información Básica</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="edit-name" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nombre *</label>
                  <input
                    ref={firstInputRef}
                    id="edit-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    placeholder="Nombre de la plataforma"
                  />
                </div>
                <div>
                  <label htmlFor="edit-slug" className="text-[10px] text-on-surface-variant uppercase tracking-wider">Slug *</label>
                  <input
                    id="edit-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-mono"
                    placeholder="netflix"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Categoría *</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={cn(
                          "py-2 rounded-xl text-xs font-semibold transition-all border",
                          formData.category === cat.value
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-surface-container-low text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "description" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Descripción</h3>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[120px]"
                placeholder="Describe la plataforma, su contenido, planes disponibles..."
              />
            </div>
          )}

          {activeSection === "branding" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Branding</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Color de Logo</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="color"
                      value={formData.logoColor}
                      onChange={(e) => setFormData({ ...formData, logoColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-white/5 cursor-pointer"
                      aria-label="Seleccionar color de logo"
                    />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black italic"
                      style={{ backgroundColor: formData.logoColor }}
                    >
                      {formData.name ? formData.name[0].toUpperCase() : "P"}
                    </div>
                    <span className="text-xs text-on-surface-variant font-mono">{formData.logoColor}</span>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">Vista Previa</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black italic shadow-lg"
                      style={{ backgroundColor: formData.logoColor }}
                    >
                      {formData.name ? formData.name[0].toUpperCase() : "P"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{formData.name || "—"}</p>
                      <p className="text-[10px] text-on-surface-variant capitalize">{formData.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "display" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">Configuración de Display</h3>
              <div className="space-y-3">
                {[
                  { key: "featured", label: "Plataforma Destacada", desc: "Mostrar en la sección destacada del catálogo" },
                  { key: "showInStore", label: "Mostrar en Tienda", desc: "Visible para clientes en la tienda pública" },
                  { key: "allowPurchases", label: "Permitir Compras", desc: "Habilitar compras de productos de esta plataforma" },
                ].map((option) => (
                  <div key={option.key} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <div>
                      <p className="text-xs font-medium text-on-surface">{option.label}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{option.desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={formData[option.key as keyof typeof formData] as boolean}
                      aria-label={option.label}
                      onClick={() => setFormData({ ...formData, [option.key]: !formData[option.key as keyof typeof formData] })}
                      className={cn(
                        "w-10 h-6 rounded-full transition-all relative focus-visible:ring-2 focus-visible:ring-primary/50",
                        formData[option.key as keyof typeof formData] ? "bg-primary" : "bg-surface-container-high"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                        formData[option.key as keyof typeof formData] ? "left-5" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
                <div>
                  <label className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(["active", "inactive", "archived"] as const).map((status) => (
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
                        {status === "active" ? "Activa" : status === "inactive" ? "Inactiva" : "Archivada"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5 focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges()}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/50",
              submitting || !hasChanges()
                ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
            )}
          >
            {submitting ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">check</span>
            )}
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
