import { TrustItem } from "@/components/molecules/trust-item"
import { BadgeCheck, MessageCircle, Star } from "lucide-react"

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Garantía total",
    description: "Soporte y reposición inmediata durante los 30 días de tu suscripción.",
    iconColor: "text-primary",
  },
  {
    icon: MessageCircle,
    title: "Soporte Real",
    description: "Atención personalizada por WhatsApp de 8:00 AM a 11:00 PM.",
    iconColor: "text-secondary",
  },
  {
    icon: Star,
    title: "+500 Clientes",
    description: "La comunidad de streaming más grande y confiable de la isla.",
    showStars: true,
  },
]

export function TrustSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 md:px-10 border-t border-border">
      <div className="grid md:grid-cols-3 gap-16">
        {trustItems.map((item) => (
          <TrustItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  )
}
