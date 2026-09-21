"use client"

import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { Icon } from "@/components/atoms/icon"
import { useSWRAccountCreditBalance } from "@/lib/api/hooks/use-sw-account"

export function CreditHeroCard() {
  const { data: balance } = useSWRAccountCreditBalance()

  return (
    <Link href="/web/account/credits">
      <GlassCard className="p-6 border-l-4 border-green-400 hover:border-green-300 transition-all group cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
              Saldo Disponible
            </p>
            <p className="text-3xl font-extrabold text-green-400 tracking-tight">
              {balance !== null ? `$${balance.balance.toFixed(2)}` : "—"}
            </p>
            <p className="text-xs text-[var(--on-surface-variant)]">
              {balance !== null ? "USD" : "Cargando..."}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="cash-multiple" className="text-[24px] text-green-400" />
          </div>
        </div>
        {balance !== null && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Icon name="arrow-up-circle" className="text-[14px] text-green-400" />
              <span className="text-xs text-[var(--on-surface-variant)]">
                Recargado: <span className="font-medium text-[var(--on-surface)]">${balance.lifetime_credited.toFixed(2)}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="arrow-down-circle" className="text-[14px] text-red-400" />
              <span className="text-xs text-[var(--on-surface-variant)]">
                Gastado: <span className="font-medium text-[var(--on-surface)]">${balance.lifetime_spent.toFixed(2)}</span>
              </span>
            </div>
          </div>
        )}
      </GlassCard>
    </Link>
  )
}
