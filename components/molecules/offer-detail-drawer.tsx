"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import {
  getOfferById,
  activateOffer,
  deactivateOffer,
  deleteOffer,
  clearOfferCache,
  type OfferWithProducts,
} from "@/lib/api/offers"
import { sileo } from "sileo"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { offerStatusMap } from "@/lib/constants/shared"

interface OfferDetailDrawerProps {
  offerId: string
  onClose: () => void
  onRefresh: () => void
}

const statusMap = offerStatusMap

export function OfferDetailDrawer({ offerId, onClose, onRefresh }: OfferDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [offer, setOffer] = useState<OfferWithProducts | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [confirmAction, setConfirmAction] = useState<"activate" | "deactivate" | "delete" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    async function fetchOffer() {
      try {
        setLoading(true)
        const data = await getOfferById(offerId)
        setOffer(data)
      } catch (err) {
        sileo.error({ title: "Error", description: "No se pudo cargar la oferta" })
      } finally {
        setLoading(false)
      }
    }
    fetchOffer()
  }, [offerId])

  const handleStatusChange = async () => {
    if (!offer) return
    setActionLoading(true)
    try {
      if (offer.status === "active") {
        await deactivateOffer(offer.id)
      } else {
        await activateOffer(offer.id)
      }
      sileo.success({ title: "Éxito", description: "Estado de oferta actualizado" })
      clearOfferCache()
      const updated = await getOfferById(offerId)
      setOffer(updated)
      onRefresh()
      setConfirmAction(null)
    } catch (err) {
      sileo.error({ title: "Error", description: "No se pudo cambiar el estado" })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!offer) return
    setActionLoading(true)
    try {
      await deleteOffer(offer.id)
      sileo.success({ title: "Éxito", description: "Oferta eliminada" })
      clearOfferCache()
      setConfirmAction(null)
      onRefresh()
      onClose()
    } catch (err) {
      sileo.error({ title: "Error", description: err instanceof Error ? err.message : "No se pudo eliminar" })
    } finally {
      setActionLoading(false)
    }
  }

  const sections = [
    { id: "overview", label: "Resumen", icon: "information" },
    { id: "products", label: "Productos", icon: "shape" },
  ]

  const confirmMessages = {
    activate: {
      title: "Activar Oferta",
      desc: `¿Activar "${offer?.title}"? Será visible para los clientes.`,
      icon: "check-circle",
      color: "green",
    },
    deactivate: {
      title: "Desactivar Oferta",
      desc: `¿Desactivar "${offer?.title}"? No será visible para los clientes.`,
      icon: "pause",
      color: "amber",
    },
    delete: {
      title: "Eliminar Oferta",
      desc: `¿Eliminar "${offer?.title}" permanentemente? Esta acción no se puede deshacer.`,
      icon: "delete",
      color: "red",
    },
  }

  const drawerContent = (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="tag" className="text-primary text-sm" />
            </div>
            <div>
              {loading ? (
                <>
                  <div className="h-4 w-32 rounded skeleton-shimmer" />
                  <div className="h-2.5 w-20 rounded skeleton-shimmer mt-1" />
                </>
              ) : (
                <>
                  <h2 className="text-base font-semibold text-on-surface">{offer?.title}</h2>
                  <p className="text-[10px] text-on-surface-variant font-mono">{offer?.id}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {offer && (
              <StatusBadge
                status={statusMap[offer.status]?.label || offer.status}
                variant={statusMap[offer.status]?.variant || "neutral"}
              />
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-white/5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold transition-all border-b-2",
                activeSection === section.id
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-on-surface"
              )}
            >
              <Icon name={section.icon} className="text-sm" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass rounded-xl p-4 space-y-3">
                    <div className="h-3 w-24 rounded skeleton-shimmer" />
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="h-14 rounded-lg skeleton-shimmer" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : offer ? (
              <>
                {activeSection === "overview" && (
                  <>
                    {/* Campaign Overview */}
                    <section className="glass rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                        <Icon name="information" className="text-sm text-primary" />
                        Resumen de Campaña
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Título", value: offer.title },
                          { label: "Tipo", value: offer.type === "discount" ? "Descuento" : "Combo" },
                          { label: "Estado", value: statusMap[offer.status]?.label || offer.status },
                          { label: "Descripción", value: offer.description || "Sin descripción" },
                          { label: "Creada", value: new Date(offer.created_at).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" }) },
                          { label: "Actualizada", value: new Date(offer.updated_at).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" }) },
                        ].map((item) => (
                          <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                            <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Discount Rules */}
                    <section className="glass rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                        <Icon name="percent" className="text-sm text-primary" />
                        Reglas de Descuento
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {offer.type === "discount" ? (
                          <>
                            {offer.discount_percent !== null && (
                              <div className="p-2.5 bg-surface-container-low rounded-lg">
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descuento Porcentual</p>
                                <p className="text-lg font-bold text-primary mt-0.5">{offer.discount_percent}%</p>
                              </div>
                            )}
                            {offer.discount_amount_usd !== null && (
                              <div className="p-2.5 bg-surface-container-low rounded-lg">
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Descuento en USD</p>
                                <p className="text-lg font-bold text-primary mt-0.5">${offer.discount_amount_usd}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {offer.combo_price_usd !== null && (
                              <div className="p-2.5 bg-surface-container-low rounded-lg">
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Combo (USD)</p>
                                <p className="text-lg font-bold text-primary mt-0.5">${offer.combo_price_usd}</p>
                              </div>
                            )}
                            {offer.combo_price_cup !== null && (
                              <div className="p-2.5 bg-surface-container-low rounded-lg">
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Precio Combo (CUP)</p>
                                <p className="text-lg font-bold text-primary mt-0.5">${offer.combo_price_cup}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </section>

                    {/* Schedule */}
                    <section className="glass rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                        <Icon name="calendar-clock" className="text-sm text-primary" />
                        Programación
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2.5 bg-surface-container-low rounded-lg">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Inicio</p>
                          <p className="text-xs font-medium text-on-surface mt-0.5">
                            {offer.start_date
                              ? new Date(offer.start_date).toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })
                              : "Sin fecha de inicio"}
                          </p>
                        </div>
                        <div className="p-2.5 bg-surface-container-low rounded-lg">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Fin</p>
                          <p className="text-xs font-medium text-on-surface mt-0.5">
                            {offer.end_date
                              ? new Date(offer.end_date).toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })
                              : "Sin fecha de fin"}
                          </p>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {activeSection === "products" && (
                  <section className="glass rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                      <Icon name="shape" className="text-sm text-primary" />
                      Productos Asociados
                    </h4>
                    {offer.products && offer.products.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
                            <tr>
                              <th className="py-2">Producto</th>
                              <th className="py-2">Plataforma</th>
                              <th className="py-2 text-right">Precio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {offer.products.map((p, i) => (
                              <tr key={i}>
                                <td className="py-2 text-xs font-medium text-on-surface">{p.product_name}</td>
                                <td className="py-2 text-xs text-on-surface-variant">{p.platform_name}</td>
                                <td className="py-2 text-xs font-semibold text-on-surface text-right">${p.product_price_sale}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant text-center py-4">No hay productos asociados</p>
                    )}
                  </section>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Icon name="alert-circle" className="text-4xl text-on-surface-variant/30 mb-3" />
                <p className="text-sm text-on-surface-variant">Oferta no encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {offer && (
          <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmAction(offer.status === "active" ? "deactivate" : "activate")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-colors",
                  offer.status === "active"
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                )}
              >
                <Icon name={offer.status === "active" ? "pause" : "check-circle"} className="text-sm" />
                {offer.status === "active" ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => setConfirmAction("delete")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20"
              >
                <Icon name="delete" className="text-sm" />
                Eliminar
              </button>
            </div>
          </div>
        )}

        {confirmAction && (
          <ConfirmDialog
            open={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            onConfirm={() => {
              if (confirmAction === "delete") {
                handleDelete()
              } else {
                handleStatusChange()
              }
            }}
            title={confirmMessages[confirmAction].title}
            description={confirmMessages[confirmAction].desc}
            icon={confirmMessages[confirmAction].icon}
            color={confirmMessages[confirmAction].color}
            loading={actionLoading}
          />
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
