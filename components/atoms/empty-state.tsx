import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
  }
  variant?: "default" | "orders" | "alerts" | "payments" | "inventory"
}

const variantClasses = {
  default: "bg-surface-container-low",
  orders: "bg-primary/5 border-primary/10",
  alerts: "bg-error/5 border-error/10",
  payments: "bg-secondary/5 border-secondary/10",
  inventory: "bg-tertiary/5 border-tertiary/10",
}

const iconColors = {
  default: "text-on-surface-variant",
  orders: "text-primary",
  alerts: "text-error",
  payments: "text-secondary",
  inventory: "text-tertiary",
}

export function EmptyState({ icon, title, description, action, variant = "default" }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-dashed", variantClasses[variant])}>
      <Icon name={icon} className={cn("text-4xl mb-3", iconColors[variant])} />
      <h4 className="text-sm font-semibold text-on-surface mb-1">{title}</h4>
      <p className="text-xs text-on-surface-variant text-center max-w-[200px]">{description}</p>
      {action && (
        <button className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          {action.label}
        </button>
      )}
    </div>
  )
}
