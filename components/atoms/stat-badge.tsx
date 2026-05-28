import { cn } from "@/lib/utils"

interface StatBadgeProps {
  label: string
  value: string
  variant?: "primary" | "secondary"
}

export function StatBadge({ label, value, variant = "primary" }: StatBadgeProps) {
  return (
    <div
      className={cn(
        "glass-panel px-6 py-4 rounded-xl border-l-4",
        variant === "primary" ? "border-red-600" : "border-blue-500"
      )}
    >
      <p className="text-xs text-neutral-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}
