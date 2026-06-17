"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface OrderDetailDrawerProps {
  orderId: string
  onClose: () => void
}

const orderData = {
  id: "ORD-2026-000482",
  createdDate: "Jun 5, 2026, 10:30 AM",
  status: "delivered",
  paymentMethod: "Zelle",
  amount: 8.99,
  customer: {
    name: "Alex Murphy",
    email: "alex.murphy@gmail.com",
    phone: "+53 555 12345",
    since: "Ene 15, 2025",
    totalOrders: 12,
  },
  products: [
    { name: "Netflix Premium 4 Screens", platform: "Netflix", quantity: 1, unitPrice: 8.99, total: 8.99 },
  ],
  payment: {
    method: "Zelle",
    reference: "ZL-20260605-XYZ123",
    date: "Jun 5, 2026, 10:45 AM",
    verificationStatus: "verified",
    proofUrl: null,
  },
  inventory: {
    assetId: "INV-000452",
    type: "Cuenta Completa",
    identifier: "ne****@gmail.com",
    assignedDate: "Jun 5, 2026, 11:30 AM",
  },
  delivery: {
    status: "delivered",
    date: "Jun 5, 2026, 12:15 PM",
    notes: "Credenciales enviadas por email al cliente.",
  },
  notes: "Cliente frecuente. Preferencia: horario de entrega matutino.",
  workflowStep: 5,
}

const workflowSteps = [
  { label: "Orden Creada", icon: "receipt" },
  { label: "Pago Enviado", icon: "credit-card" },
  { label: "Pago Verificado", icon: "check-decagram" },
  { label: "Inventario Asignado", icon: "package-variant" },
  { label: "Entregada", icon: "truck" },
  { label: "Completada", icon: "check-circle" },
]

const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  pending: { label: "Pendiente", variant: "warning" },
  payment_submitted: { label: "Pago Enviado", variant: "neutral" },
  payment_review: { label: "Revisión de Pago", variant: "warning" },
  approved: { label: "Aprobada", variant: "success" },
  inventory_assigned: { label: "Inventario Asignado", variant: "success" },
  delivered: { label: "Entregada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "error" },
  refunded: { label: "Reembolsada", variant: "error" },
}

export function OrderDetailDrawer({ orderId, onClose }: OrderDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("info")
  const [noteText, setNoteText] = useState(orderData.notes)
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
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="receipt" className="text-primary text-sm" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">{orderData.id}</h2>
              <p className="text-[10px] text-on-surface-variant">Creada: {orderData.createdDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              status={statusMap[orderData.status].label}
              variant={statusMap[orderData.status].variant}
            />
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            {/* Workflow Progress */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-4 flex items-center gap-2">
                <Icon name="progress-wrench" className="text-sm text-primary" />
                Flujo de Procesamiento
              </h4>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-container-high">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((orderData.workflowStep - 1) / (workflowSteps.length - 1)) * 100}%` }}
                  />
                </div>
                {workflowSteps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      i < orderData.workflowStep
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : i === orderData.workflowStep - 1
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-surface-container-high text-on-surface-variant"
                    )}>
                      <Icon name={step.icon} className="text-sm" />
                    </div>
                    <span className={cn(
                      "text-[9px] mt-1.5 text-center max-w-[60px] leading-tight",
                      i <= orderData.workflowStep - 1 ? "text-primary font-semibold" : "text-on-surface-variant"
                    )}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="information" className="text-sm text-primary" />
                Información de Orden
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Número de Orden", value: orderData.id },
                  { label: "Fecha de Creación", value: orderData.createdDate },
                  { label: "Método de Pago", value: orderData.paymentMethod },
                  { label: "Monto Total", value: `$${orderData.amount.toFixed(2)}` },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                <div className="mt-1">
                  <StatusBadge
                    status={statusMap[orderData.status].label}
                    variant={statusMap[orderData.status].variant}
                  />
                </div>
              </div>
            </section>

            {/* Customer Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="account" className="text-sm text-primary" />
                Información del Cliente
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Nombre Completo", value: orderData.customer.name },
                  { label: "Email", value: orderData.customer.email },
                  { label: "Teléfono", value: orderData.customer.phone },
                  { label: "Cliente Desde", value: orderData.customer.since },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total de Órdenes</p>
                <p className="text-xs font-medium text-on-surface mt-0.5">{orderData.customer.totalOrders}</p>
              </div>
            </section>

            {/* Purchased Products */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="cart" className="text-sm text-primary" />
                Productos Comprados
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
                    <tr>
                      <th className="py-2">Producto</th>
                      <th className="py-2">Plataforma</th>
                      <th className="py-2">Cant.</th>
                      <th className="py-2">Precio Unit.</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orderData.products.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2 text-xs font-medium text-on-surface">{p.name}</td>
                        <td className="py-2 text-xs text-on-surface-variant">{p.platform}</td>
                        <td className="py-2 text-xs text-on-surface-variant">{p.quantity}</td>
                        <td className="py-2 text-xs text-on-surface-variant">${p.unitPrice.toFixed(2)}</td>
                        <td className="py-2 text-xs font-semibold text-on-surface text-right">${p.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Payment Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="credit-card" className="text-sm text-primary" />
                Información de Pago
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Método de Pago</p>
                  <p className="text-xs font-medium text-on-surface mt-0.5">{orderData.payment.method}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Referencia</p>
                  <p className="text-xs font-mono text-on-surface mt-0.5">{orderData.payment.reference}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Pago</p>
                  <p className="text-xs font-medium text-on-surface mt-0.5">{orderData.payment.date}</p>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado de Verificación</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={orderData.payment.verificationStatus === "verified" ? "Verificado" : "Pendiente"}
                      variant={orderData.payment.verificationStatus === "verified" ? "success" : "warning"}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Assigned Inventory */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="package-variant" className="text-sm text-primary" />
                Inventario Asignado
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ID del Activo", value: orderData.inventory.assetId },
                  { label: "Tipo", value: orderData.inventory.type },
                  { label: "Identificador", value: orderData.inventory.identifier },
                  { label: "Fecha de Asignación", value: orderData.inventory.assignedDate },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Info */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="truck" className="text-sm text-primary" />
                Información de Entrega
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                  <div className="mt-1">
                    <StatusBadge status="Entregada" variant="success" />
                  </div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fecha de Entrega</p>
                  <p className="text-xs font-medium text-on-surface mt-0.5">{orderData.delivery.date}</p>
                </div>
              </div>
              <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Notas de Entrega</p>
                <p className="text-xs text-on-surface mt-0.5">{orderData.delivery.notes}</p>
              </div>
            </section>

            {/* Internal Notes */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Icon name="note-text" className="text-sm text-primary" />
                Notas Internas
              </h4>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-white/5 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none min-h-[80px]"
                placeholder="Notas privadas sobre esta orden..."
              />
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Icon name="truck" className="text-sm" />
              Entregar Orden
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5">
              <Icon name="pencil" className="text-sm" />
              Editar
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20">
              <Icon name="undo" className="text-sm" />
              Reembolsar
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20">
              <Icon name="cancel" className="text-sm" />
              Cancelar Orden
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
