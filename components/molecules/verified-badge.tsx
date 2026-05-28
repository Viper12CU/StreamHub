import { Badge } from "@/components/atoms/badge"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  label: string
  className?: string
}

export function VerifiedBadge({ label, className }: VerifiedBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-primary",
      className
    )}>
      <BadgeCheck className="w-4 h-4" fill="currentColor" />
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  )
}
