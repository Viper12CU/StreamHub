import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "success" | "error" | "warning" | "neutral"
}

const variantClasses = {
  success: "bg-green-500/10 text-green-400",
  error: "bg-error-container/20 text-error",
  warning: "bg-amber-500/20 text-amber-500",
  neutral: "bg-surface-container-high text-on-surface-variant",
}

export function StatusBadge({ status, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", variantClasses[variant])}>
      {status}
    </span>
  )
}
