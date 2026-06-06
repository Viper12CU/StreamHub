"use client"

import { cn } from "@/lib/utils"

interface Insight {
  icon: string
  title: string
  count: number | string
  description: string
  color: string
  iconBg: string
}

const insights: Insight[] = [
  {
    icon: "diamond",
    title: "Mayor Valor de Vida",
    count: "10 clientes",
    description: "Clientes con LTV > $200",
    color: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: "person_off",
    title: "Inactivos 30+ Días",
    count: 27,
    description: "Sin actividad reciente",
    color: "text-error",
    iconBg: "bg-error/10",
  },
  {
    icon: "timer",
    title: "Suscripciones por Expirar",
    count: 45,
    description: "Próximos 7 días",
    color: "text-orange-400",
    iconBg: "bg-orange-400/10",
  },
  {
    icon: "repeat",
    title: "Compras Repetidas",
    count: 156,
    description: "3+ órdenes este mes",
    color: "text-green-400",
    iconBg: "bg-green-400/10",
  },
]

const highestLtv = [
  { name: "Marcus V.", value: "$456.78", orders: 22 },
  { name: "Alex Murphy", value: "$324.50", orders: 18 },
  { name: "María García", value: "$267.85", orders: 15 },
]

export function CustomerInsights() {
  return (
    <div className="space-y-5">
      {/* Insight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((insight, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", insight.iconBg)}>
                <span className={cn("material-symbols-outlined text-sm", insight.color)}>{insight.icon}</span>
              </div>
              <span className={cn("text-lg font-bold", insight.color)}>{insight.count}</span>
            </div>
            <p className="text-xs font-semibold text-on-surface">{insight.title}</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Highest LTV Customers */}
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500 text-sm">diamond</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface">Clientes de Mayor Valor</h3>
        </div>
        <div className="divide-y divide-white/5">
          {highestLtv.map((customer, i) => (
            <div key={i} className="p-3 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-on-surface-variant w-4">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {customer.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-on-surface">{customer.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{customer.orders} órdenes</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary">{customer.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
