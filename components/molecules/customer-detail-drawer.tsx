"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"
import { cn } from "@/lib/utils"

interface CustomerDetailDrawerProps {
  customerId: string
  onClose: () => void
}

const customerData = {
  id: "CUS-2026-000421",
  name: "Alex Murphy",
  email: "alex.murphy@gmail.com",
  phone: "+53 555 12345",
  country: "Cuba",
  registrationDate: "Ene 12, 2026",
  status: "vip",
  lastLogin: "Hace 2 horas",
  totalOrders: 18,
  lifetimeValue: 324.50,
  subscriptions: [
    { name: "Netflix Premium 4 Screens", platform: "Netflix", expires: "Mar 15, 2026" },
    { name: "Spotify Family", platform: "Spotify", expires: "Feb 28, 2026" },
    { name: "Disney+ Shared Profile", platform: "Disney+", expires: "Abr 10, 2026" },
  ],
  recentOrders: [
    { number: "ORD-2026-000482", product: "Netflix Premium 4 Screens", amount: 8.99, status: "delivered", date: "Jun 5, 2026" },
    { number: "ORD-2026-000465", product: "Spotify Family", amount: 14.99, status: "delivered", date: "May 28, 2026" },
    { number: "ORD-2026-000451", product: "Disney+ Shared Profile", amount: 7.99, status: "delivered", date: "May 15, 2026" },
  ],
  payment: {
    totalPayments: 18,
    lastPayment: "Jun 5, 2026",
    preferredMethod: "Zelle",
  },
  support: {
    openTickets: 0,
    lastInteraction: "May 20, 2026",
  },
  notes: "Cliente VIP frecuente. Siempre paga a tiempo. Preferencia: horario de entrega matutino. Contacto preferido: email.",
}

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  vip: { label: "VIP", variant: "warning" },
  inactive: { label: "Inactivo", variant: "neutral" },
  suspended: { label: "Suspendido", variant: "error" },
}

const orderStatusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  delivered: { label: "Entregada", variant: "success" },
  pending: { label: "Pendiente", variant: "warning" },
  cancelled: { label: "Cancelada", variant: "error" },
}

const platformColors: Record<string, string> = {
  Netflix: "bg-primary-container",
  Spotify: "bg-secondary",
  "Disney+": "bg-tertiary",
  "YouTube Premium": "bg-[#ff0000]",
  "HBO Max": "bg-[#b829e3]",
  Crunchyroll: "bg-[#f47521]",
  IPTV: "bg-amber-500",
}

export function CustomerDetailDrawer({ customerId, onClose }: CustomerDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [noteText, setNoteText] = useState(customerData.notes)
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const drawerContent = (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              AM
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">{customerData.name}</h2>
              <p className="text-[10px] text-on-surface-variant">{customerData.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              status={statusMap[customerData.status].label}
              variant={statusMap[customerData.status].variant}
            />
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            {/* Basic Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">person</span>
                Información Básica
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Nombre Completo", value: customerData.name },
                  { label: "Email", value: customerData.email },
                  { label: "Teléfono", value: customerData.phone },
                  { label: "País", value: customerData.country },
                  { label: "Fecha de Registro", value: customerData.registrationDate },
                  { label: "Último Login", value: customerData.lastLogin },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Status */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                Estado de la Cuenta
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={statusMap[customerData.status].label}
                      variant={statusMap[customerData.status].variant}
                    />
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Último Login</p>
                  <p className="text-xs font-medium text-on-surface mt-0.5">{customerData.lastLogin}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total Órdenes</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5">{customerData.totalOrders}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Valor de Vida</p>
                  <p className="text-xs font-bold text-primary mt-0.5">${customerData.lifetimeValue.toFixed(2)}</p>
                </div>
              </div>
            </section>

            {/* Active Products */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">subscriptions</span>
                Productos Activos
              </h4>
              <div className="space-y-2">
                {customerData.subscriptions.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={cn("w-2.5 h-2.5 rounded-full", platformColors[sub.platform] || "bg-surface-container-highest")} />
                      <div>
                        <p className="text-xs font-medium text-on-surface">{sub.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{sub.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant">Expira</p>
                      <p className="text-[10px] font-medium text-on-surface">{sub.expires}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Orders */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">receipt_long</span>
                Órdenes Recientes
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
                    <tr>
                      <th className="py-2">Orden</th>
                      <th className="py-2">Producto</th>
                      <th className="py-2">Monto</th>
                      <th className="py-2">Estado</th>
                      <th className="py-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {customerData.recentOrders.map((order, i) => (
                      <tr key={i}>
                        <td className="py-2 text-xs font-semibold text-primary">{order.number}</td>
                        <td className="py-2 text-xs text-on-surface">{order.product}</td>
                        <td className="py-2 text-xs font-semibold text-on-surface">${order.amount.toFixed(2)}</td>
                        <td className="py-2">
                          <StatusBadge
                            status={orderStatusMap[order.status]?.label || order.status}
                            variant={orderStatusMap[order.status]?.variant || "neutral"}
                          />
                        </td>
                        <td className="py-2 text-[10px] text-on-surface-variant">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Payment History */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">account_balance_wallet</span>
                Historial de Pagos
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total Pagos</p>
                  <p className="text-lg font-bold text-on-surface mt-1">{customerData.payment.totalPayments}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Último Pago</p>
                  <p className="text-xs font-medium text-on-surface mt-1">{customerData.payment.lastPayment}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Método Preferido</p>
                  <p className="text-xs font-bold text-primary mt-1">{customerData.payment.preferredMethod}</p>
                </div>
              </div>
            </section>

            {/* Support Activity */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">support_agent</span>
                Actividad de Soporte
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Tickets Abiertos</p>
                  <p className={cn(
                    "text-lg font-bold mt-1",
                    customerData.support.openTickets > 0 ? "text-amber-500" : "text-green-400"
                  )}>
                    {customerData.support.openTickets}
                  </p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Última Interacción</p>
                  <p className="text-xs font-medium text-on-surface mt-1">{customerData.support.lastInteraction}</p>
                </div>
              </div>
            </section>

            {/* Internal Notes */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">notes</span>
                Notas Internas
              </h4>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                placeholder="Notas privadas sobre este cliente..."
              />
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">edit</span>
              Editar Cliente
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5">
              <span className="material-symbols-outlined text-sm">mail</span>
              Enviar Mensaje
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20">
              <span className="material-symbols-outlined text-sm">diamond</span>
              Marcar VIP
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20">
              <span className="material-symbols-outlined text-sm">block</span>
              Suspender
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 10000 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(null)} />
          <div className="relative glass rounded-2xl p-6 w-[400px] space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">Confirmar Acción</h3>
            <p className="text-xs text-on-surface-variant">
              ¿Estás seguro de que deseas {showConfirmModal}? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
