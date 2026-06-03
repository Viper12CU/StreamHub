import { Logo } from "@/components/atoms/logo"
import { Button } from "@/components/atoms/button"
import Link from "next/link"
import { CreditCard, Landmark, Wifi } from "lucide-react"

const footerLinks = [
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/checkout", label: "Checkout" },
]

export function Footer() {
  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-border" id="contacto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-16 px-6 max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="space-y-4 text-center md:text-left">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StreamHub Cuba. Entrega instantánea y garantía premium.
          </p>
          <div className="flex gap-4 justify-center md:justify-start pt-2">
            <CreditCard className="w-5 h-5 opacity-50" />
            <Landmark className="w-5 h-5 opacity-50" />
            <Wifi className="w-5 h-5 opacity-50" />
          </div>
        </div>
        
        {/* Right Side */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-10 text-sm">
            {footerLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <a
            href="https://wa.me/5350000000"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="whatsapp" className="rounded-full">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-3.732c1.531.909 3.321 1.389 5.146 1.391 5.428 0 9.845-4.417 9.848-9.847.002-2.628-1.025-5.1-2.891-6.967-1.866-1.867-4.337-2.893-6.966-2.893-5.431 0-9.848 4.417-9.851 9.848-.001 1.83.479 3.617 1.391 5.15l-1.02 3.723 3.812-1.005zm10.747-7.46c-.29-.145-1.711-.845-1.977-.941-.266-.096-.461-.145-.654.145-.194.291-.749.942-.919 1.136-.17.193-.34.217-.631.072-.29-.145-1.226-.452-2.334-1.441-.861-.768-1.442-1.718-1.611-2.009-.17-.291-.018-.448.127-.593.131-.13.29-.34.436-.508.145-.17.193-.291.291-.484.097-.194.048-.363-.024-.508-.073-.145-.654-1.576-.896-2.158-.236-.567-.474-.49-.654-.499-.17-.008-.363-.01-.556-.01-.193 0-.507.072-.772.362-.266.291-1.015.992-1.015 2.417s1.039 2.796 1.185 2.99c.145.193 2.043 3.119 4.949 4.373.691.298 1.23.477 1.65.612.693.22 1.325.189 1.823.114.555-.083 1.711-.699 1.953-1.376.242-.676.242-1.258.17-1.376-.073-.118-.266-.192-.556-.338z"/>
              </svg>
              Soporte WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </footer>
  )
}
