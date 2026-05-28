import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StepCardProps {
  stepNumber: number
  title: string
  description: string
  icon: LucideIcon
  variant?: "primary" | "secondary"
  className?: string
}

export function StepCard({ 
  stepNumber, 
  title, 
  description, 
  icon: IconComponent, 
  variant = "primary",
  className 
}: StepCardProps) {
  const bgClass = variant === "primary" 
    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30" 
    : "bg-secondary text-secondary-foreground shadow-xl shadow-secondary/30"

  return (
    <div className={cn("flex-1 flex flex-col items-center text-center gap-6 z-10", className)}>
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center text-3xl",
        bgClass
      )}>
        <IconComponent className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-semibold">{stepNumber}. {title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
