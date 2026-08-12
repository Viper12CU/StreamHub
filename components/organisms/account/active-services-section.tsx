'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Icon } from '@/components/atoms/icon'
import { getMyProfile, type Subscription } from '@/lib/api/account'

const platformIcons: Record<string, string> = {
  netflix: 'movie-open-play',
  spotify: 'music',
  'disney-plus': 'disney-plus',
  youtube: 'youtube',
  hbo: 'hbo',
}

function getPlatformIcon(slug: string): string {
  return platformIcons[slug] || 'television'
}

function getSubscriptionStatus(sub: Subscription): { label: string; tone: string; bg: string } {
  if (!sub.expires_at) return { label: 'Activo', tone: 'text-primary', bg: 'bg-primary/10 border-primary/20' }
  const days = Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / 86400000)
  if (days <= 0) return { label: 'Expirado', tone: 'text-[var(--on-surface-variant)]/60', bg: 'bg-white/5 border-white/10' }
  if (days <= 7) return { label: `Vence en ${days} dias`, tone: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' }
  if (days <= 30) return { label: `Vence en ${days} dias`, tone: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' }
  return { label: 'Activo', tone: 'text-primary', bg: 'bg-primary/10 border-primary/20' }
}

export function ActiveServicesSection() {
  const [services, setServices] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyProfile()
      .then((p) => setServices(p.subscriptions))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="flash" className="text-primary" />
          Servicios Activos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <GlassCard key={i} className="h-40 animate-pulse">&nbsp;</GlassCard>
          ))}
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="flash" className="text-primary" />
          Servicios Activos
        </h2>
        <GlassCard className="p-8 text-center">
          <Icon name="television-off" className="text-4xl text-[var(--on-surface-variant)] mb-3 block mx-auto" />
          <p className="text-sm text-[var(--on-surface-variant)]">No tienes servicios activos aun.</p>
        </GlassCard>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="flash" className="text-primary" />
          Servicios Activos
        </h2>
        <Link href="/web/account/active-services" className="text-xs uppercase tracking-[0.2em] text-primary">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {services.map((service) => {
          const status = getSubscriptionStatus(service)
          return (
            <GlassCard key={`${service.platform_slug}-${service.product_name}`} className="overflow-hidden">
              <div className="h-1" style={{ backgroundColor: service.platform_color || '#666' }} />
              <div className="p-5 flex flex-col md:flex-row gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface-container-high)] flex items-center justify-center border border-white/10">
                  <Icon
                    name={getPlatformIcon(service.platform_slug)}
                    className="text-[36px]"
                    style={{ color: service.platform_color || undefined }}
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{service.platform_name}</h3>
                    <span
                      className={`text-[11px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${status.bg} ${status.tone}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)]">Tipo: {service.product_name}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" className="rounded-xl px-4 py-2 text-xs">
                      <Icon name="eye" className="text-[16px]" />
                      Ver credenciales
                    </Button>
                    <Button className="rounded-xl px-4 py-2 text-xs">
                      <Icon name="autorenew" className="text-[16px]" />
                      Renovar
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
