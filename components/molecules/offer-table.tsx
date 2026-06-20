"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Icon } from "@/components/atoms/icon"
import type { Offer } from "@/lib/api/offers"

interface OfferTableProps {
  offers: Offer[]
  loading: boolean
  selectedOffers: string[]
  onSelectOffers: (ids: string[]) => void
  onRowClick: (id: string) => void
  viewMode: "grid" | "table"
}

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activa", variant: "success" },
  inactive: { label: "Inactiva", variant: "warning" },
  expired: { label: "Expirada", variant: "error" },
}

const typeStyles: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  discount: { bg: "bg-primary/15", text: "text-primary", icon: "percent", label: "Descuento" },
  combo: { bg: "bg-purple-500/15", text: "text-purple-400", icon: "package-variant", label: "Combo" },
}

function getDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null
  const end = new Date(endDate)
  const now = new Date()
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

function getOfferType(offer: Offer): string {
  if (offer.discount_percent) return `${offer.discount_percent}%`
  if (offer.discount_amount_usd) return `$${offer.discount_amount_usd} OFF`
  if (offer.combo_price_usd) return `$${offer.combo_price_usd}`
  return offer.type
}

function formatDateShort(date: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("es-ES", { month: "short", day: "numeric" })
}

export function OfferTable({
  offers,
  loading,
  selectedOffers,
  onSelectOffers,
  onRowClick,
  viewMode,
}: OfferTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectOffers([])
    } else {
      onSelectOffers(offers.map((o) => o.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectOffer = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = selectedOffers.includes(id)
      ? selectedOffers.filter((oid) => oid !== id)
      : [...selectedOffers, id]
    onSelectOffers(updated)
    setSelectAll(updated.length === offers.length)
  }

  if (loading) {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-on-surface">Gestión de Campañas</h3>
        </div>
        <div className="p-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-4 h-4 rounded skeleton-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-48 rounded skeleton-shimmer" />
                <div className="h-2 w-24 rounded skeleton-shimmer" />
              </div>
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-on-surface">Gestión de Campañas</h3>
          <span className="text-xs text-on-surface-variant">{offers.length} oferta{offers.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {offers.map((offer) => {
            const daysLeft = getDaysRemaining(offer.end_date)
            const isExpiring = daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && offer.status === "active"
            const style = typeStyles[offer.type] || typeStyles.discount

            return (
              <div
                key={offer.id}
                onClick={() => onRowClick(offer.id)}
                className="glass rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{offer.title}</p>
                    {offer.description && (
                      <p className="text-[10px] text-on-surface-variant truncate mt-0.5">{offer.description}</p>
                    )}
                  </div>
                  <StatusBadge
                    status={statusMap[offer.status]?.label || offer.status}
                    variant={statusMap[offer.status]?.variant || "neutral"}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase">Tipo</p>
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold", style.text)}>
                      <Icon name={style.icon} className="text-[10px]" />
                      {style.label}
                    </span>
                  </div>
                  <div className="text-center p-2 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase">Valor</p>
                    <p className="text-xs font-bold text-primary">{getOfferType(offer)}</p>
                  </div>
                  <div className="text-center p-2 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase">Productos</p>
                    <p className="text-xs font-bold text-on-surface">{offer.products?.length ?? 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                  <span>{formatDateShort(offer.start_date)} — {formatDateShort(offer.end_date)}</span>
                  {isExpiring && (
                    <span className="text-amber-500 font-semibold">{daysLeft}d rest.</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {offers.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="tag-off" className="text-4xl text-on-surface-variant/30 mb-3" />
            <p className="text-sm text-on-surface-variant">No se encontraron ofertas</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-base font-semibold text-on-surface">Gestión de Campañas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded accent-primary"
                />
              </th>
              <th className="py-3">Oferta</th>
              <th className="py-3">Tipo</th>
              <th className="py-3">Descuento</th>
              <th className="py-3">Productos</th>
              <th className="py-3">Vigencia</th>
              <th className="py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {offers.map((offer) => {
              const daysLeft = getDaysRemaining(offer.end_date)
              const isExpiring = daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && offer.status === "active"
              const style = typeStyles[offer.type] || typeStyles.discount

              return (
                <tr
                  key={offer.id}
                  onClick={() => onRowClick(offer.id)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedOffers.includes(offer.id)}
                      onChange={(e) => handleSelectOffer(e, offer.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded accent-primary"
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">{offer.title}</span>
                      {offer.description && (
                        <span className="text-[10px] text-on-surface-variant max-w-[180px] truncate">{offer.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold",
                      style.bg, style.text
                    )}>
                      <Icon name={style.icon} className="text-xs" />
                      {style.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs font-semibold text-on-surface">
                      {getOfferType(offer)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-on-surface-variant">
                      {offer.products?.length ?? 0} producto{(offer.products?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-on-surface-variant">
                        {formatDateShort(offer.start_date)} — {formatDateShort(offer.end_date)}
                      </span>
                      {isExpiring ? (
                        <span className="text-[10px] text-amber-500 font-semibold">
                          {daysLeft} día{daysLeft !== 1 ? "s" : ""} rest.
                        </span>
                      ) : offer.status === "active" && daysLeft !== null ? (
                        <span className="text-[10px] text-on-surface-variant">
                          {daysLeft} días rest.
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      status={statusMap[offer.status]?.label || offer.status}
                      variant={statusMap[offer.status]?.variant || "neutral"}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {offers.length === 0 ? (
        <div className="p-12 text-center">
          <Icon name="tag-off" className="text-4xl text-on-surface-variant/30 mb-3" />
          <p className="text-sm text-on-surface-variant">No se encontraron ofertas</p>
        </div>
      ) : (
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Mostrando {offers.length} oferta{offers.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}
