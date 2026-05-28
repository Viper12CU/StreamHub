import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  name: string
  description: string
  price: number
  currency?: string
  icon: LucideIcon
  badge: string
  accentColor: string
  className?: string
}

export function ServiceCard({ 
  name, 
  description, 
  price, 
  currency = "MLC/CUP",
  icon: IconComponent, 
  badge,
  accentColor,
  className 
}: ServiceCardProps) {
  return (
    <div 
      className={cn(
        "service-card glass-panel rounded-2xl overflow-hidden border-t-4",
        className
      )}
      style={{ borderTopColor: accentColor }}
    >
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <IconComponent 
              className="w-8 h-8" 
              style={{ color: accentColor }}
              fill="currentColor"
            />
          </div>
          <Badge 
            variant="custom" 
            bgColor={`${accentColor}15`}
            textColor={accentColor}
          >
            {badge}
          </Badge>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        
        <div className="flex justify-between items-center pt-6">
          <span className="text-xl font-semibold">
            Desde ${price}{" "}
            <span className="text-sm font-normal text-muted-foreground">{currency}</span>
          </span>
          <Link href={`/producto/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))}`}>
            <Button size="sm">Ver opciones</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
