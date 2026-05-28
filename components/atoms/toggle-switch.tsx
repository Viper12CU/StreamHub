"use client"

import { cn } from "@/lib/utils"

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
        enabled
          ? "bg-red-600"
          : "bg-neutral-800 border border-white/20"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-all",
          enabled
            ? "right-1 bg-white"
            : "left-1 bg-neutral-400"
        )}
      />
    </button>
  )
}
