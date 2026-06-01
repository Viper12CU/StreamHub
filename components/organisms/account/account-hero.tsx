'use client'

import { GlassCard } from '@/components/ui/glass-card'

export function AccountHero() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Hola, Jorge <span className="inline-block">👋</span>
        </h1>
        <p className="text-[var(--on-surface-variant)] text-base md:text-lg">
          Bienvenido de vuelta. Aqui tienes el resumen de tu cuenta.
        </p>
      </div>
      <div className="flex gap-4">
        <GlassCard className="px-5 py-4 border-l-4 border-primary">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Activos</p>
          <p className="text-xl font-semibold">2 Cuentas</p>
        </GlassCard>
        <GlassCard className="px-5 py-4 border-l-4 border-secondary">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Total</p>
          <p className="text-xl font-semibold">14 Compras</p>
        </GlassCard>
      </div>
    </div>
  )
}
