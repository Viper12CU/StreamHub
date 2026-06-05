import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  description?: string
  value: string
  accent?: string
  badge?: string
  badgeColor?: string
  icon?: string
  iconColor?: string
}

export function MetricCard({ label, description, value, accent = "border-primary", badge, badgeColor = "text-primary", icon, iconColor = "text-on-surface-variant" }: MetricCardProps) {
  return (
    <div className={cn("glass p-4 rounded-xl border-l-4 flex flex-col gap-1", accent)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
        {icon && <span className={cn("material-symbols-outlined text-sm", iconColor)}>{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-on-surface">
        {value}
        {badge && <span className={cn("text-xs font-bold ml-1", badgeColor)}>{badge}</span>}
      </p>
      {description && <p className="text-[10px] text-on-surface-variant opacity-60">{description}</p>}
    </div>
  )
}
