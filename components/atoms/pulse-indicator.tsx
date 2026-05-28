import { cn } from "@/lib/utils"

interface PulseIndicatorProps {
  label: string
  className?: string
}

export function PulseIndicator({ label, className }: PulseIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="text-xs font-semibold tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
