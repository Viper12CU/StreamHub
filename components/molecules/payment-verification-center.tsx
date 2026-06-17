"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

const pendingVerifications = [
  { id: "ORD-2026-000480", customer: "Jordan Smith", amount: 7.99, paymentMethod: "MLC", submissionTime: "Hace 5 horas", hasProof: true, urgent: false },
  { id: "ORD-2026-000479", customer: "Luna Rodriguez", amount: 9.99, paymentMethod: "Zelle", submissionTime: "Hace 6 horas", hasProof: true, urgent: false },
  { id: "ORD-2026-000478", customer: "Marcus V.", amount: 11.99, paymentMethod: "Transfermóvil", submissionTime: "Hace 26 horas", hasProof: true, urgent: true },
  { id: "ORD-2026-000476", customer: "Carlos M.", amount: 5.99, paymentMethod: "MLC", submissionTime: "Hace 28 horas", hasProof: false, urgent: true },
  { id: "ORD-2026-000474", customer: "David Lee", amount: 4.99, paymentMethod: "Zelle", submissionTime: "Hace 3 días", hasProof: true, urgent: true },
]

export function PaymentVerificationCenter() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Icon name="shield-check" className="text-amber-500 text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-on-surface">Órdenes Esperando Verificación</h3>
            <p className="text-[10px] text-on-surface-variant">{pendingVerifications.length} pendientes</p>
          </div>
        </div>
        {pendingVerifications.some((o) => o.urgent) && (
          <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold rounded-full animate-pulse">
            {pendingVerifications.filter((o) => o.urgent).urgent ? pendingVerifications.filter((o) => o.urgent).length : 0} urgentes
          </span>
        )}
      </div>
      <div className="divide-y divide-white/5">
        {pendingVerifications.map((order) => (
          <div
            key={order.id}
            className={cn(
              "p-4 hover:bg-white/[0.02] transition-colors",
              order.urgent && "bg-error/[0.03] border-l-2 border-error"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">{order.id}</span>
                  {order.urgent && (
                    <span className="px-1.5 py-0.5 bg-error/10 text-error text-[9px] font-bold rounded-full">
                      +24h
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface font-medium">{order.customer}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-semibold text-on-surface">${order.amount.toFixed(2)}</span>
                  <span className="text-[10px] text-on-surface-variant">{order.paymentMethod}</span>
                  <span className={cn(
                    "text-[10px]",
                    order.urgent ? "text-error font-semibold" : "text-on-surface-variant"
                  )}>
                    {order.submissionTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {order.hasProof && (
                  <button className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                    <Icon name="image" className="text-sm" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20">
                <Icon name="check" className="text-sm" />
                Aprobar
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors border border-error/20">
                <Icon name="close" className="text-sm" />
                Rechazar
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors border border-white/5">
                <Icon name="replay" className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
