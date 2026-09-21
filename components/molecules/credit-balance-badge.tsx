"use client"

import { memo } from "react"
import { Icon } from "@/components/atoms/icon"
import { cn } from "@/lib/utils"
import { useSWRAccountCreditBalance } from "@/lib/api/hooks/use-sw-account"

interface CreditBalanceBadgeProps {
  collapsed?: boolean
  className?: string
}

export const CreditBalanceBadge = memo(function CreditBalanceBadge({ collapsed = false, className }: CreditBalanceBadgeProps) {
  const { data: balance } = useSWRAccountCreditBalance()

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-[var(--surface-container-low)] border border-white/5 transition-all",
        collapsed ? "p-2 justify-center" : "gap-3 p-3",
        className
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
        <Icon name="cash-multiple" className="text-[16px] text-green-400" />
      </div>
      {!collapsed && (
        <div className="overflow-hidden">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--on-surface-variant)]">
            Créditos
          </p>
          <p className="text-sm font-semibold text-green-400 truncate">
            {balance !== null ? `$${balance.balance.toFixed(2)} USD` : "—"}
          </p>
        </div>
      )}
    </div>
  )
})
