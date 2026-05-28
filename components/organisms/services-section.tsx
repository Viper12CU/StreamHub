import { SectionTitle } from "@/components/atoms/section-title"
import { ServiceCard } from "@/components/molecules/service-card"
import { 
  Film, 
  Music, 
  Sparkles, 
  Play, 
  ShoppingBag,
  Palette
} from "lucide-react"

const services = [
  {
    name: "Netflix",
    description: "Cuentas completas o perfiles compartidos con PIN de seguridad.",
    price: 250,
    icon: Film,
    badge: "4K + HDR",
    accentColor: "#E50914",
  },
  {
    name: "Spotify",
    description: "Música sin anuncios y modo offline. Activación en tu propia cuenta.",
    price: 150,
    icon: Music,
    badge: "FAMILIAR/DUO",
    accentColor: "#1DB954",
  },
  {
    name: "Disney+",
    description: "Acceso a todo el contenido de Disney, Star+, Marvel y National Geographic.",
    price: 200,
    icon: Sparkles,
    badge: "PIXAR/MARVEL",
    accentColor: "#006E99",
  },
  {
    name: "YouTube Premium",
    description: "Disfruta de YouTube y YouTube Music sin anuncios en todos tus dispositivos.",
    price: 180,
    icon: Play,
    badge: "SIN ANUNCIOS",
    accentColor: "#FF0000",
  },
  {
    name: "Prime Video",
    description: "The Boys, El Señor de los Anillos y más producciones originales en 4K.",
    price: 120,
    icon: ShoppingBag,
    badge: "ORIGINALS",
    accentColor: "#00A8E1",
  },
  {
    name: "Canva Pro",
    description: "Herramientas de diseño premium, banco de imágenes y kit de marca.",
    price: 100,
    icon: Palette,
    badge: "PROFESIONAL",
    accentColor: "#00C4CC",
  },
]

export function ServicesSection() {
  return (
    <section className="py-16 w-full mx-auto px-4 md:px-70 bg-card/50" id="catalogo">
      <SectionTitle 
        title="Lo que tenemos para ti"
        subtitle="Selecciona tu plataforma favorita y comienza a disfrutar del mejor contenido sin límites."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.name} {...service} />
        ))}
      </div>
    </section>
  )
}
