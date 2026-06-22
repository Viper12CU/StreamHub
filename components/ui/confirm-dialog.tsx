"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

/**
 * Generic confirmation modal – identical visual style to the one used in
 * `PlatformDetailDrawer`. It receives all dynamic content via props, making it
 * reusable across the application.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is visible */
  open: boolean
  /** Called when the user cancels or clicks the backdrop */
  onClose: () => void
  /** Called when the user confirms the action */
  onConfirm: () => Promise<void> | void
  /** Title displayed at the top of the dialog */
  title: string
  /** Description or body text – can be a string or JSX */
  description: React.ReactNode
  /** Name of the icon to show (matches the <Icon /> component names) */
  icon: string
  /** Color theme – determines background and text colours. Accepts "green", "amber" or "red". */
  color: string;
  /** Label for the confirm button – defaults to "Confirmar" */
  confirmLabel?: string
  /** Label for the cancel button – defaults to "Cancelar" */
  cancelLabel?: string
  /** Show loading state while the confirm action is processing */
  loading?: boolean
  /** Optional custom z‑index for the overlay */
  zIndex?: number
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  color,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  zIndex = 10000,
}: ConfirmDialogProps) {
  if (!open) return null

  const handleBackdropClick = () => {
    if (!loading) onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleBackdropClick} />
      <div className="relative glass rounded-2xl w-[420px] p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon header */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
            color === "green" && "bg-green-500/10",
            color === "amber" && "bg-amber-500/10",
            color === "red" && "bg-red-500/10",
          )}
        >
          <Icon
            name={icon}
            className={cn(
              "text-xl",
              color === "green" && "text-green-400",
              color === "amber" && "text-amber-500",
              color === "red" && "text-red-500",
            )}
          />
        </div>
        {/* Title & description */}
        <h3 className="text-base font-semibold text-on-surface mb-2">{title}</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>
        {/* Action buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              color === "green" && "bg-green-500 text-white hover:bg-green-500/90",
              color === "amber" && "bg-amber-500 text-white hover:bg-amber-500/90",
              color === "red" && "bg-red-500 text-white hover:bg-red-500/90",
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="loading" className="text-sm animate-spin" />
                Procesando...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
