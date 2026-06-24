"use client"

import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/atoms/icon"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getCustomerById, updateCustomer, clearCustomerCache, type CustomerDetail } from "@/lib/api/customers"
import { sileo } from "sileo"
import { customerStatusMap, orderStatusMap, getInitials, getRelativeDate } from "@/lib/constants/shared"

interface CustomerDetailDrawerProps {
  customerId: string
  onClose: () => void
  onRefresh?: () => void
}

const statusMap = customerStatusMap

export function CustomerDetailDrawer({ customerId, onClose, onRefresh }: CustomerDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [confirmAction, setConfirmAction] = useState<"vip" | "suspended" | "reactivate" | "deactivate-vip" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  const confirmMessages = {
    vip: {
      title: "Marcar como VIP",
      desc: "¿Estás seguro de que deseas marcar este cliente como VIP? Tendrá acceso prioritario y trato preferencial.",
      icon: "diamond",
      color: "amber",
    },
    suspended: {
      title: "Suspender Cliente",
      desc: "¿Estás seguro de que deseas suspender este cliente? No podrá realizar compras ni acceder a servicios.",
      icon: "account-off",
      color: "red",
    },
    reactivate: {
      title: "Reactivar Cliente",
      desc: "¿Estás seguro de que deseas reactivar este cliente? Podrá realizar compras nuevamente.",
      icon: "check-circle",
      color: "green",
    },
    "deactivate-vip": {
      title: "Quitar VIP",
      desc: "¿Estás seguro de que deseas quitar el estado VIP a este cliente? Perderá los privilegios prioritarios.",
      icon: "account-remove",
      color: "amber",
    },
  }

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCustomerById(customerId)
      setCustomer(data)
      setNoteText(data.notes || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar cliente")
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    fetchCustomer()
    return () => { document.body.style.overflow = "" }
  }, [fetchCustomer])

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const getRelativeDate = (dateStr: string | null) => {
    if (!dateStr) return "Nunca"
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Hoy"
    if (days === 1) return "Ayer"
    if (days < 7) return `Hace ${days} días`
    if (days < 30) return `Hace ${Math.floor(days / 7)} sem`
    return `Hace ${Math.floor(days / 30)} meses`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleSaveNotes = async () => {
    if (!customer) return
    try {
      setSavingNotes(true)
      await updateCustomer(customer.id, { notes: noteText })
      setCustomer({ ...customer, notes: noteText })
      clearCustomerCache()
      sileo.success({ title: "Notas guardadas", description: "Las notas internas se han actualizado." })
    } catch {
      sileo.error({ title: "Error", description: "No se pudieron guardar las notas." })
    } finally {
      setSavingNotes(false)
    }
  }

  const handleStatusChange = async (newStatus: "vip" | "suspended" | "active") => {
    if (!customer) return
    try {
      setActionLoading(true)
      await updateCustomer(customer.id, { status: newStatus })
      setCustomer({ ...customer, status: newStatus })
      clearCustomerCache()
      const labels = { vip: "marcado como VIP", suspended: "suspendido", active: "activado" }
      sileo.success({ title: "Estado actualizado", description: `Cliente ${labels[newStatus]} correctamente.` })
      onRefresh?.()
    } catch {
      sileo.error({ title: "Error", description: "No se pudo actualizar el estado." })
    } finally {
      setActionLoading(false)
      setConfirmAction(null)
    }
  }

  const drawerContent = (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {loading ? (
              <>
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </>
            ) : customer ? (
              <>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {getInitials(customer.name)}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-on-surface">{customer.name}</h2>
                  <p className="text-[10px] text-on-surface-variant">{customer.email}</p>
                </div>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {customer && (
              <StatusBadge
                status={statusMap[customer.status]?.label || customer.status}
                variant={statusMap[customer.status]?.variant || "neutral"}
              />
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-5 space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-14 rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-3">
              <Icon name="alert-circle" className="text-3xl text-error/50 block" />
              <p className="text-sm text-on-surface">{error}</p>
              <button
                onClick={fetchCustomer}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : customer ? (
            <div className="p-5 space-y-5">
              {/* Basic Info */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="account" className="text-sm text-primary" />
                  Información Básica
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Nombre Completo", value: customer.name },
                    { label: "Email", value: customer.email },
                    { label: "Teléfono", value: customer.phone || "—" },
                    { label: "País", value: customer.country || "—" },
                    { label: "WhatsApp", value: customer.whatsapp || "—" },
                    { label: "Registro", value: formatDate(customer.created_at) },
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
                  <Icon name="chart-areaspline" className="text-sm text-primary" />
                  Estado de la Cuenta
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Estado</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={statusMap[customer.status]?.label || customer.status}
                        variant={statusMap[customer.status]?.variant || "neutral"}
                      />
                    </div>
                  </div>
                  <div className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Última Compra</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">
                      {customer.last_purchase ? getRelativeDate(customer.last_purchase) : "—"}
                    </p>
                  </div>
                  <div className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Total Órdenes</p>
                    <p className="text-xs font-bold text-on-surface mt-0.5">{customer.total_orders}</p>
                  </div>
                  <div className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Valor de Vida</p>
                    <p className="text-xs font-bold text-primary mt-0.5">${Number(customer.lifetime_value ?? 0).toFixed(2)}</p>
                  </div>
                </div>
              </section>

              {/* Active Subscriptions */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="account-reactivate" className="text-sm text-primary" />
                  Suscripciones Activas
                </h4>
                {(!customer.subscriptions || customer.subscriptions.length === 0) ? (
                  <p className="text-xs text-on-surface-variant opacity-60 text-center py-4">No hay suscripciones activas</p>
                ) : (
                  <div className="space-y-2">
                    {customer.subscriptions.map((sub, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: sub.platform_color || undefined }}
                          />
                          <div>
                            <p className="text-xs font-medium text-on-surface">{sub.product_name}</p>
                            <p className="text-[10px] text-on-surface-variant">{sub.platform_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-on-surface-variant">Expira</p>
                          <p className="text-[10px] font-medium text-on-surface">{formatDate(sub.expires_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Orders */}
              <section className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="receipt" className="text-sm text-primary" />
                  Órdenes Recientes
                </h4>
                {(!customer.recent_orders || customer.recent_orders.length === 0) ? (
                  <p className="text-xs text-on-surface-variant opacity-60 text-center py-4">No hay órdenes recientes</p>
                ) : (
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
                        {customer.recent_orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="py-2 text-xs font-semibold text-primary">{order.order_number}</td>
                            <td className="py-2 text-xs text-on-surface">{order.product_name}</td>
                            <td className="py-2 text-xs font-semibold text-on-surface">${order.amount_usd.toFixed(2)}</td>
                            <td className="py-2">
                              <StatusBadge
                                status={orderStatusMap[order.status]?.label || order.status}
                                variant={orderStatusMap[order.status]?.variant || "neutral"}
                              />
                            </td>
                            <td className="py-2 text-[10px] text-on-surface-variant">{formatDate(order.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  placeholder="Notas privadas sobre este cliente..."
                />
                {noteText !== (customer?.notes || "") && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[10px] font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {savingNotes ? <Icon name="progress-clock" className="text-xs" /> : <Icon name="check" className="text-xs" />}
                      {savingNotes ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
          <div className="flex gap-2">
            {customer?.status === "vip" ? (
              <button
                onClick={() => setConfirmAction("deactivate-vip")}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5 disabled:opacity-50"
              >
                <Icon name="account-remove" className="text-sm" />
                Quitar VIP
              </button>
            ) : (
              <button
                onClick={() => setConfirmAction("vip")}
                disabled={actionLoading || customer?.status === "suspended"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors border border-amber-500/20 disabled:opacity-50"
              >
                <Icon name="diamond" className="text-sm" />
                Marcar VIP
              </button>
            )}
            {customer?.status === "suspended" ? (
              <button
                onClick={() => setConfirmAction("reactivate")}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 text-green-400 text-xs font-semibold rounded-xl hover:bg-green-500/20 transition-colors border border-green-500/20 disabled:opacity-50"
              >
                <Icon name="check-circle" className="text-sm" />
                Reactivar
              </button>
            ) : (
              <button
                onClick={() => setConfirmAction("suspended")}
                disabled={actionLoading || customer?.status === "vip"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20 disabled:opacity-50"
              >
                <Icon name="block" className="text-sm" />
                Suspender
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmAction && (
          <ConfirmDialog
            open={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            onConfirm={() => {
              if (confirmAction === "reactivate" || confirmAction === "deactivate-vip") {
                handleStatusChange("active")
              } else {
                handleStatusChange(confirmAction)
              }
            }}
            title={confirmMessages[confirmAction].title}
            description={confirmMessages[confirmAction].desc}
            icon={confirmMessages[confirmAction].icon}
            color={confirmMessages[confirmAction].color}
            loading={actionLoading}
          />
        )}
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
