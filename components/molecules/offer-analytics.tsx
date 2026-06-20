"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"
import type { Offer } from "@/lib/api/offers"

interface OfferAnalyticsProps {
  offers: Offer[]
  loading: boolean
}

export function OfferAnalytics({ offers, loading }: OfferAnalyticsProps) {
  const activeOffers = offers.filter((o) => o.status === "active")
  const inactiveOffers = offers.filter((o) => o.status === "inactive")
  const expiredOffers = offers.filter((o) => o.status === "expired")

  const discountOffers = offers.filter((o) => o.type === "discount")
  const comboOffers = offers.filter((o) => o.type === "combo")

  const statusData = [
    { label: "Activas", count: activeOffers.length, percentage: offers.length > 0 ? (activeOffers.length / offers.length) * 100 : 0, color: "bg-green-400" },
    { label: "Inactivas", count: inactiveOffers.length, percentage: offers.length > 0 ? (inactiveOffers.length / offers.length) * 100 : 0, color: "bg-amber-500" },
    { label: "Expiradas", count: expiredOffers.length, percentage: offers.length > 0 ? (expiredOffers.length / offers.length) * 100 : 0, color: "bg-error" },
  ]

  const typeData = [
    { label: "Descuento", count: discountOffers.length, color: "bg-primary" },
    { label: "Combo", count: comboOffers.length, color: "bg-purple-500" },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-5 rounded-xl border border-white/5">
            <div className="h-4 w-40 rounded skeleton-shimmer mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-8 rounded skeleton-shimmer" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Offers by Status */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="chart-donut" className="text-sm text-primary" />
          Ofertas por Estado
        </h3>
        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {statusData.filter((s) => s.count > 0).reduce<{ elements: JSX.Element[]; offset: number }>((acc, item, i) => {
                const circumference = 2 * Math.PI * 12
                const dash = (item.percentage / 100) * circumference
                acc.elements.push(
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="12"
                    fill="none"
                    className={item.color}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={-acc.offset}
                    opacity="0.9"
                  />
                )
                acc.offset += dash
                return acc
              }, { elements: [], offset: 0 }).elements}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-bold text-on-surface">{offers.length}</p>
                <p className="text-[9px] text-on-surface-variant">total</p>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex-1 space-y-2">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                  <span className="text-[11px] text-on-surface-variant">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-on-surface">{item.count}</span>
                  <span className="text-[9px] text-on-surface-variant">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Offers by Type */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="tag" className="text-sm text-primary" />
          Ofertas por Tipo
        </h3>
        <div className="space-y-4">
          {typeData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="text-xs font-medium text-on-surface">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-on-surface">{item.count}</span>
                  <span className="text-[10px] text-on-surface-variant">
                    {offers.length > 0 ? ((item.count / offers.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", item.color)}
                  style={{ width: offers.length > 0 ? `${(item.count / offers.length) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discount Offers Summary */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="percent" className="text-sm text-primary" />
          Ofertas de Descuento
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-surface-container-low rounded-xl">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Con % Descuento</p>
            <p className="text-lg font-bold text-on-surface mt-0.5">
              {discountOffers.filter((o) => o.discount_percent !== null).length}
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Con $ Descuento</p>
            <p className="text-lg font-bold text-on-surface mt-0.5">
              {discountOffers.filter((o) => o.discount_amount_usd !== null).length}
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Promedio % Descuento</p>
            <p className="text-lg font-bold text-on-surface mt-0.5">
              {discountOffers.filter((o) => o.discount_percent !== null).length > 0
                ? `${(discountOffers.filter((o) => o.discount_percent !== null).reduce((sum, o) => sum + (o.discount_percent || 0), 0) / discountOffers.filter((o) => o.discount_percent !== null).length).toFixed(1)}%`
                : "N/A"
              }
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Ofertas Combo</p>
            <p className="text-lg font-bold text-on-surface mt-0.5">{comboOffers.length}</p>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="chart-bar" className="text-sm text-primary" />
          Resumen de Estado
        </h3>
        <div className="space-y-3">
          {statusData.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="text-xs font-medium text-on-surface">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-on-surface">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
