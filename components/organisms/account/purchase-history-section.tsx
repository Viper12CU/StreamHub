'use client'

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Icon } from '@/components/atoms/icon'
import { getMyOrders, type MyOrder } from '@/lib/api/account'
import { formatDate } from '@/lib/constants/shared'

const orderStatusDisplay: Record<string, { label: string; icon: string; tone: string }> = {
  pending: { label: 'Pendiente', icon: 'clock-outline', tone: 'text-amber-300' },
  proof_sent: { label: 'Pago Enviado', icon: 'receipt', tone: 'text-blue-400' },
  confirmed: { label: 'Confirmada', icon: 'check', tone: 'text-primary' },
  delivered: { label: 'Entregado', icon: 'check-circle', tone: 'text-emerald-400' },
  cancelled: { label: 'Cancelada', icon: 'close-circle', tone: 'text-red-400' },
}

const paymentMethodLabels: Record<string, string> = {
  transfermovil: 'Transfermovil',
  zelle: 'Zelle',
  mlc: 'MLC',
}

export function PurchaseHistorySection() {
  const [orders, setOrders] = useState<MyOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="history" className="text-secondary" />
          Historial de compras
        </h2>
        <GlassCard className="h-48 animate-pulse">&nbsp;</GlassCard>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="history" className="text-secondary" />
          Historial de compras
        </h2>
        <GlassCard className="p-8 text-center">
          <Icon name="shopping-outline" className="text-4xl text-[var(--on-surface-variant)] mb-3 block mx-auto" />
          <p className="text-sm text-[var(--on-surface-variant)]">Aun no tienes compras.</p>
        </GlassCard>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="history" className="text-secondary" />
        Historial de compras
      </h2>
      <GlassCard className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/5">
            <tr>
              {['Fecha', 'Servicio', 'Monto', 'Metodo', 'Estado', 'Accion'].map((label) => (
                <th
                  key={label}
                  className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[var(--on-surface-variant)]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => {
              const status = orderStatusDisplay[order.status] || orderStatusDisplay.pending
              return (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-sm">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.product_title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium">${order.amount_usd} USD</td>
                  <td className="px-5 py-4 text-[var(--on-surface-variant)]">
                    {paymentMethodLabels[order.payment_method] || order.payment_method}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1 text-sm font-medium ${status.tone}`}>
                      <Icon name={status.icon} className="text-[18px]" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-secondary text-xs uppercase tracking-[0.2em]">
                      {order.order_number}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </section>
  )
}
