"use client"

import { useState, useEffect, memo } from "react"
import Link from "next/link"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { getAudits, type Audit, type AuditCategory } from "@/lib/api/audits"

interface RecentAuditActivityProps {
  category?: AuditCategory
  limit?: number
  title?: string
}

const categoryConfig: Record<AuditCategory, { icon: string; color: string; bg: string; label: string }> = {
  platform: { icon: "monitor-shimmer", color: "text-primary", bg: "bg-primary/20", label: "Plataforma" },
  product: { icon: "package-variant", color: "text-secondary", bg: "bg-secondary/20", label: "Producto" },
  inventory: { icon: "cube-send", color: "text-tertiary", bg: "bg-tertiary/20", label: "Inventario" },
  order: { icon: "cart", color: "text-green-400", bg: "bg-green-400/20", label: "Orden" },
  customer: { icon: "account", color: "text-purple-400", bg: "bg-purple-400/20", label: "Cliente" },
  credit: { icon: "currency-usd", color: "text-amber-500", bg: "bg-amber-500/20", label: "Crédito" },
  user: { icon: "account-circle", color: "text-blue-400", bg: "bg-blue-400/20", label: "Usuario" },
  offer: { icon: "tag", color: "text-pink-400", bg: "bg-pink-400/20", label: "Oferta" },
  wishlist: { icon: "heart", color: "text-red-400", bg: "bg-red-400/20", label: "Lista de Deseos" },
  system: { icon: "cog", color: "text-on-surface-variant", bg: "bg-surface-container-high", label: "Sistema" },
}

const statusConfig: Record<string, { color: string }> = {
  info: { color: "text-primary" },
  warning: { color: "text-amber-500" },
  error: { color: "text-error" },
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Ahora"
  if (minutes < 60) return `Hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

function ActivitySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-2.5 w-14" />
        </div>
      ))}
    </div>
  )
}

function RecentAuditActivityInner({ category, limit = 10, title }: RecentAuditActivityProps) {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getAudits(category ? { category } : {}, 1, limit)
      .then((res) => {
        if (!cancelled) setAudits(res.data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [category, limit])

  const displayTitle = title || (category ? `Actividad de ${categoryConfig[category].label}` : "Actividad Reciente")

  return (
    <div className="glass p-5 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <Icon name="history" className="text-sm text-primary" />
          {displayTitle}
        </h3>
        <Link
          href={category ? `/admin/audit?category=${category}` : "/admin/audit"}
          className="text-primary text-[11px] font-semibold hover:underline"
        >
          Ver toda
        </Link>
      </div>

      {loading ? (
        <ActivitySkeleton count={limit > 10 ? 8 : limit} />
      ) : audits.length === 0 ? (
        <p className="text-xs text-on-surface-variant opacity-60 text-center py-8">No hay actividad reciente</p>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-4">
            {audits.map((audit) => {
              const cat = categoryConfig[audit.category] || categoryConfig.system
              const sColor = statusConfig[audit.status]?.color || "text-on-surface-variant"
              return (
                <div key={audit.id} className="flex gap-3 items-start relative">
                  <div className={`w-8 h-8 rounded-full ${cat.bg} flex items-center justify-center z-10`}>
                    <Icon name={cat.icon} className={`text-sm ${cat.color}`} />
                  </div>
                  <div className="flex-1 flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-xs text-on-surface truncate">{audit.message}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-medium ${sColor}`}>
                          {audit.status === "info" ? "Info" : audit.status === "warning" ? "Alerta" : "Error"}
                        </span>
                        {audit.entity_type && (
                          <>
                            <span className="text-[10px] text-on-surface-variant/40">·</span>
                            <span className="text-[10px] text-on-surface-variant">{audit.entity_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-on-surface-variant opacity-60 whitespace-nowrap ml-2 shrink-0">
                      {getRelativeTime(audit.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const RecentAuditActivity = memo(RecentAuditActivityInner)
