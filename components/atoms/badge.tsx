import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "primary" | "success" | "info" | "warning" | "custom"
  className?: string
  bgColor?: string
  textColor?: string
}

export function Badge({ 
  children, 
  variant = "primary", 
  className,
  bgColor,
  textColor 
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-600/10 text-[#1DB954]",
    info: "bg-blue-600/10 text-[#006E99]",
    warning: "bg-yellow-600/10 text-yellow-500",
    custom: "",
  }

  return (
    <span 
      className={cn(
        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wide",
        variant !== "custom" && variantClasses[variant],
        className
      )}
      style={variant === "custom" ? { backgroundColor: bgColor, color: textColor } : undefined}
    >
      {children}
    </span>
  )
}
