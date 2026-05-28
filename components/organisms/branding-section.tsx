import { Logo } from "@/components/atoms/logo"
import { FloatingLogos } from "@/components/molecules/floating-logos"

export function BrandingSection() {
  return (
    <section className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center p-16">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 animated-gradient opacity-30" />
      
      {/* Floating Logos */}
      <FloatingLogos />
      
      {/* Central Branding */}
      <div className="relative z-10 text-center space-y-6 max-w-md">
        <h1 className="text-5xl font-extrabold text-primary drop-shadow-2xl tracking-tighter">
          StreamHub
        </h1>
        <p className="text-2xl font-semibold text-foreground leading-tight">
          Todo lo que necesitas ver y escuchar, desde Cuba.
        </p>
        <div className="h-1 w-24 bg-primary mx-auto rounded-full mt-10" />
      </div>
    </section>
  )
}
