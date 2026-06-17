"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

const statusData = [
  { label: "Entregadas", count: 1117, percentage: 89.5, color: "bg-green-400" },
  { label: "Aprobadas", count: 42, percentage: 3.4, color: "bg-primary" },
  { label: "Asignación", count: 15, percentage: 1.2, color: "bg-secondary" },
  { label: "Pendientes", count: 18, percentage: 1.4, color: "bg-amber-500" },
  { label: "Revisión Pago", count: 7, percentage: 0.6, color: "bg-orange-400" },
  { label: "Canceladas", count: 24, percentage: 1.9, color: "bg-error" },
  { label: "Reembolsadas", count: 25, percentage: 2.0, color: "bg-surface-container-highest" },
]

const paymentData = [
  { method: "Transfermóvil", orders: 512, revenue: 4892.50, percentage: 41, color: "bg-green-500" },
  { method: "Zelle", orders: 428, revenue: 3956.20, percentage: 34.3, color: "bg-purple-500" },
  { method: "MLC", orders: 308, revenue: 2831.40, percentage: 24.7, color: "bg-amber-500" },
]

const revenueData = [
  { label: "Hoy", value: "$342.50", change: "+12%", positive: true },
  { label: "Esta Semana", value: "$2,180.00", change: "+8%", positive: true },
  { label: "Este Mes", value: "$8,920.10", change: "+15%", positive: true },
  { label: "Promedio/Orden", value: "$7.68", change: "+0.5%", positive: true },
]

const volumeData = [
  { day: "Lun", orders: 42 },
  { day: "Mar", orders: 38 },
  { day: "Mié", orders: 51 },
  { day: "Jue", orders: 45 },
  { day: "Vie", orders: 62 },
  { day: "Sáb", orders: 48 },
  { day: "Dom", orders: 35 },
]

const maxOrders = Math.max(...volumeData.map((d) => d.orders))

export function OrderAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Orders by Status */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="chart-donut" className="text-sm text-primary" />
          Órdenes por Estado
        </h3>
        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {statusData.reduce<{ elements: JSX.Element[]; offset: number }>((acc, item, i) => {
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
                <p className="text-lg font-bold text-on-surface">1,248</p>
                <p className="text-[9px] text-on-surface-variant">total</p>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex-1 space-y-1.5">
            {statusData.map((item, i) => (
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

      {/* Orders by Payment Method */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="wallet" className="text-sm text-primary" />
          Órdenes por Método de Pago
        </h3>
        <div className="space-y-4">
          {paymentData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="text-xs font-medium text-on-surface">{item.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-on-surface-variant">{item.orders} órdenes</span>
                  <span className="text-xs font-semibold text-on-surface">${item.revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", item.color)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Orders */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="trending-up" className="text-sm text-primary" />
          Ingresos por Órdenes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {revenueData.map((item, i) => (
            <div key={i} className="p-3 bg-surface-container-low rounded-xl">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-lg font-bold text-on-surface">{item.value}</p>
                <span className={cn(
                  "text-[10px] font-semibold mb-0.5",
                  item.positive ? "text-green-400" : "text-error"
                )}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Volume Trend */}
      <div className="glass p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Icon name="chart-line" className="text-sm text-primary" />
          Volumen de Órdenes
        </h3>
        <div className="flex items-end gap-2 h-32">
          {volumeData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-semibold text-on-surface">{item.orders}</span>
              <div
                className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary"
                style={{ height: `${(item.orders / maxOrders) * 100}%` }}
              />
              <span className="text-[9px] text-on-surface-variant">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
