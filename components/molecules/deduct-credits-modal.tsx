"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Icon } from "@/components/atoms/icon"
import { deductCredits, clearCreditsCache } from "@/lib/api/credits"

interface DeductCreditsModalProps {
  customerId: string
  userName?: string
  onClose: () => void
  onCreated: () => void
}

export function DeductCreditsModal({ customerId, userName, onClose, onCreated }: DeductCreditsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const canProceed = step === 0 ? Number(amount) > 0 : true

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      await deductCredits(customerId, { amount: Number(amount), reason: reason || undefined })
      clearCreditsCache()
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al deducir créditos")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-[520px] max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Deducir Créditos</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              {userName ? `De: ${userName}` : "Selecciona un usuario"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center hover:bg-surface-container-low transition-colors"
            aria-label="Cerrar"
          >
            <Icon name="close" className="text-sm" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 py-4 border-b border-white/5">
          {["Monto", "Resumen"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                step >= i ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium ${step >= i ? "text-on-surface" : "text-on-surface-variant"}`}>
                {label}
              </span>
              {i < 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2">
            <Icon name="alert-circle" className="text-error text-sm shrink-0" />
            <p className="text-xs text-error">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="deduct-amount" className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Monto a Deducir
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                  <input
                    id="deduct-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="deduct-reason" className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Razón (Opcional)
                </label>
                <textarea
                  id="deduct-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Motivo de la deducción de créditos..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
                <p className="text-[10px] text-on-surface-variant/60 text-right">{reason.length}/500</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass rounded-xl p-5 border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="alert-circle" className="text-red-400" />
                  <h3 className="text-sm font-semibold text-on-surface">Resumen</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Usuario</span>
                    <span className="text-on-surface">{userName || customerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Monto</span>
                    <span className="text-red-400 font-bold">-${Number(amount).toFixed(2)}</span>
                  </div>
                  {reason && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Razón</span>
                      <span className="text-on-surface max-w-[250px] text-right truncate">{reason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5"
            >
              Anterior
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5"
          >
            Cancelar
          </button>
          {step === 0 ? (
            <button
              onClick={() => setStep(1)}
              disabled={!canProceed}
              className="flex-1 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-500/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
            >
              {loading ? "Procesando..." : "Deducir Créditos"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
