import { Icon } from "@/components/atoms/icon"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureBadgeProps {
  icon: LucideIcon
  label: string
  className?: string
}

export function FeatureBadge({ icon, label, className }: FeatureBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
      <Icon icon={icon} size="md" className="text-primary" />
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  )
}
