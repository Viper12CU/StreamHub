'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { purchases } from '@/components/data/account'

export function PurchaseHistorySection() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary" data-icon="history">
          history
        </span>
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
            {purchases.map((row) => (
              <tr key={`${row.date}-${row.service}`} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-4 text-sm">{row.date}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-medium">{row.service}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium">{row.amount}</td>
                <td className="px-5 py-4 text-[var(--on-surface-variant)]">{row.method}</td>
                <td className="px-5 py-4">
                  <span className={`flex items-center gap-1 text-sm font-medium ${row.statusTone}`}>
                    <span className="material-symbols-outlined text-[18px]" data-icon={row.statusIcon}>
                      {row.statusIcon}
                    </span>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-secondary hover:underline text-xs uppercase tracking-[0.2em]">
                    {row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </section>
  )
}
