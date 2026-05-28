import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface TrustItemProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
  showStars?: boolean
  className?: string
}

export function TrustItem({ 
  icon: IconComponent, 
  title, 
  description, 
  iconColor = "text-primary",
  showStars = false,
  className 
}: TrustItemProps) {
  return (
    <div className={cn("space-y-4 text-center", className)}>
      {showStars ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex text-yellow-500 mb-8">
            {[...Array(5)].map((_, i) => (
              <IconComponent key={i} className="w-6 h-6" fill="currentColor" />
            ))}
          </div>
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="text-muted-foreground">{description}</p>
        </div>
      ) : (
        <>
          <IconComponent className={cn("w-12 h-12 mx-auto", iconColor)} fill="currentColor" />
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="text-muted-foreground">{description}</p>
        </>
      )}
    </div>
  )
}
