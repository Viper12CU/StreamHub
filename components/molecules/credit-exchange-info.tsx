"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Icon } from "@/components/atoms/icon"
import { useState } from "react"

interface CreditExchangeInfoProps {
  exchangeRate: number | null
}

export function CreditExchangeInfo({ exchangeRate }: CreditExchangeInfoProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const date = new Date()
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
  const today = date.toLocaleDateString("es-ES", options)

  return (
    <GlassCard className="p-4 border-l-4 border-blue-400">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon name="information" className="text-[20px] text-blue-400" />
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[var(--on-surface)]">
              1 crédito = 1 USD
            </p>
            <span className="relative inline-flex items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Icon name="help-circle" size="sm" className="cursor-help text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]" />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-2 glass-panel rounded-lg text-xs text-[var(--on-surface-variant)] whitespace-nowrap shadow-lg z-10">
                  Tus créditos se mantienen en USD y no se devalúan
                  <span className="absolute -bottom-2 left-0 w-full h-2" />
                </div>
              )}
            </span>
          </div>
          <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
            Cada crédito equivale a un dólar estadounidense. El saldo se mantiene en USD para proteger tu inversión.
          </p>
          {exchangeRate !== null && (
            <div className="flex items-center gap-1.5 pt-1">
              <Icon name="cash" size="sm" className="text-green-400" />
              <span className="text-xs text-[var(--on-surface-variant)]">
                Tasa USD → CUP:{" "}
                <span className="font-semibold text-[var(--on-surface)]">
                  ${exchangeRate.toLocaleString("es-ES")} CUP
                </span>
                <span className="text-[10px] ml-1 opacity-60">
                  ({today}) vía{" "}
                  <a
                    href="https://eltoque.com/tasas-de-cambio-cuba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    elToque
                  </a>
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
