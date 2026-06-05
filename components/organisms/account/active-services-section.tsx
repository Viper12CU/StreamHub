'use client'

import Link from 'next/link'
import { Button } from '@/components/atoms/button'
import { GlassCard } from '@/components/ui/glass-card'
import { activeServices } from '@/components/data/account'

export function ActiveServicesSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" data-icon="bolt">
            bolt
          </span>
          Servicios Activos
        </h2>
        <Link href="/web/account/active-services" className="text-xs uppercase tracking-[0.2em] text-primary">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {activeServices.map((service) => (
          <GlassCard key={service.title} className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: service.accent }} />
            <div className="p-5 flex flex-col md:flex-row gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-container-high)] flex items-center justify-center border border-white/10">
                <span
                  className="material-symbols-outlined text-[36px]"
                  style={{ color: service.accent }}
                  data-icon={service.icon}
                >
                  {service.icon}
                </span>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <span
                    className={`text-[11px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${service.statusBg} ${service.statusTone}`}
                  >
                    {service.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">{service.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" className="rounded-xl px-4 py-2 text-xs">
                    <span className="material-symbols-outlined text-[16px]" data-icon="visibility">
                      visibility
                    </span>
                    Ver credenciales
                  </Button>
                  <Button className="rounded-xl px-4 py-2 text-xs">
                    <span className="material-symbols-outlined text-[16px]" data-icon="autorenew">
                      autorenew
                    </span>
                    Renovar
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
