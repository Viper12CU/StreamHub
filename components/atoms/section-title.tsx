import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function SectionTitle({ title, subtitle, className, centered = true }: SectionTitleProps) {
  return (
    <div className={cn("mb-16", centered && "text-center", className)}>
      <h2 className="text-3xl font-bold leading-tight mb-4">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}
