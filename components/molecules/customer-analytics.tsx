"use client"

import { cn } from "@/lib/utils"

const segmentData = [
  { label: "VIP", count: 118, percentage: 3.4, color: "bg-amber-500" },
  { label: "Regulares", count: 2965, percentage: 85.2, color: "bg-primary" },
  { label: "Nuevos", count: 214, percentage: 6.1, color: "bg-secondary" },
  { label: "Inactivos", count: 185, percentage: 5.3, color: "bg-surface-container-highest" },
]

const topCustomers = [
  { name: "Marcus V.", orders: 22, lifetimeValue: 456.78 },
  { name: "Alex Murphy", orders: 18, lifetimeValue: 324.50 },
  { name: "María García", orders: 15, lifetimeValue: 267.85 },
  { name: "Sarah Chen", orders: 12, lifetimeValue: 189.90 },
  { name: "Jordan Smith", orders: 8, lifetimeValue: 95.80 },
  { name: "Elena Kas", orders: 6, lifetimeValue: 71.94 },
  { name: "Ana López", orders: 9, lifetimeValue: 127.91 },
  { name: "Luna Rodriguez", orders: 3, lifetimeValue: 42.97 },
  { name: "Carlos M.", orders: 1, lifetimeValue: 5.99 },
  { name: "David Lee", orders: 0, lifetimeValue: 0 },
]

const retentionData = [
  { label: "Tasa de Recompra", value: "68.4%", icon: "repeat", color: "text-green-400" },
  { label: "Valor Promedio/Orden", value: "$8.72", icon: "attach_money", color: "text-primary" },
  { label: "Clientes Activos", value: "85.2%", icon: "check_circle", color: "text-secondary" },
]

const growthData = [
  { month: "Ene", value: 45 },
  { month: "Feb", value: 62 },
  { month: "Mar", value: 78 },
  { month: "Abr", value: 95 },
  { month: "May", value: 110 },
  { month: "Jun", value: 85 },
]

const maxGrowth = Math.max(...growthData.map((d) => d.value))

export function CustomerAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Customer Growth */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
          Crecimiento de Clientes
        </h3>
        <div className="flex items-end gap-2 h-32">
          {growthData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-semibold text-on-surface">{item.value}</span>
              <div
                className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary"
                style={{ height: `${(item.value / maxGrowth) * 100}%` }}
              />
              <span className="text-[9px] text-on-surface-variant">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Segment */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">donut_large</span>
          Ingresos por Segmento
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {segmentData.reduce<{ elements: JSX.Element[]; offset: number }>((acc, item, i) => {
                const circumference = 2 * Math.PI * 12
                const dash = (item.percentage / 100) * circumference
                acc.elements.push(
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="12"
                    fill="none"
                    className={item.color}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={-acc.offset}
                    opacity="0.9"
                  />
                )
                acc.offset += dash
                return acc
              }, { elements: [], offset: 0 }).elements}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-bold text-on-surface">3,482</p>
                <p className="text-[9px] text-on-surface-variant">total</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {segmentData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", item.color)} />
                  <span className="text-[11px] text-on-surface-variant">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-on-surface">{item.count.toLocaleString()}</span>
                  <span className="text-[9px] text-on-surface-variant">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">emoji_events</span>
          Mejores Clientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
              <tr>
                <th className="py-2">#</th>
                <th className="py-2">Cliente</th>
                <th className="py-2 text-right">Órdenes</th>
                <th className="py-2 text-right">Valor Vida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topCustomers.slice(0, 8).map((customer, i) => (
                <tr key={i}>
                  <td className="py-2 text-[10px] font-bold text-on-surface-variant">{i + 1}</td>
                  <td className="py-2 text-xs font-medium text-on-surface">{customer.name}</td>
                  <td className="py-2 text-xs text-on-surface-variant text-right">{customer.orders}</td>
                  <td className="py-2 text-xs font-semibold text-primary text-right">${customer.lifetimeValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retention Overview */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">assessment</span>
          Retención
        </h3>
        <div className="space-y-4">
          {retentionData.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className={cn("material-symbols-outlined text-sm", item.color)}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-bold text-on-surface mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
