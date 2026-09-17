'use client'

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Icon } from '@/components/atoms/icon'
import { useSession } from '@/lib/session-context'
import { getMyProfile, getMyCreditBalance, type MyProfile, type MyCreditBalance } from '@/lib/api/account'

export function AccountHero() {
  const { user } = useSession()
  const [stats, setStats] = useState<Pick<MyProfile, 'active_subscriptions' | 'total_orders'> | null>(null)
  const [balance, setBalance] = useState<MyCreditBalance | null>(null)

  useEffect(() => {
    getMyProfile()
      .then((p) => setStats({ active_subscriptions: p.active_subscriptions, total_orders: p.total_orders }))
      .catch(() => {})
    getMyCreditBalance()
      .then(setBalance)
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Hola, {user?.name?.split(' ')[0] ?? '...'} <span className="inline-block">👋</span>
        </h1>
        <p className="text-[var(--on-surface-variant)] text-base md:text-lg">
          Bienvenido de vuelta. Aqui tienes el resumen de tu cuenta.
        </p>
      </div>
      <div className="flex gap-4 flex-wrap">
        <GlassCard className="px-5 py-4 border-l-4 border-primary">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Activos</p>
          <p className="text-xl font-semibold">
            {stats !== null ? `${stats.active_subscriptions} Cuentas` : '—'}
          </p>
        </GlassCard>
        <GlassCard className="px-5 py-4 border-l-4 border-secondary">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Total</p>
          <p className="text-xl font-semibold">
            {stats !== null ? `${stats.total_orders} Compras` : '—'}
          </p>
        </GlassCard>
        <GlassCard className="px-5 py-4 border-l-4 border-green-400">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">Créditos</p>
          <p className="text-xl font-semibold text-green-400">
            {balance !== null ? `$${balance.balance.toFixed(2)}` : '—'}
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
