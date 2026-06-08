import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "rect" | "circle" | "text"
  animate?: boolean
}

export function Skeleton({ className, variant = "rect", animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        animate && "skeleton-shimmer",
        !animate && "bg-surface-container-high",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded",
        variant === "rect" && "rounded-lg",
        className
      )}
    />
  )
}
