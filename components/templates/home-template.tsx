import { Navbar } from "@/components/organisms/navbar"
import { HeroSection } from "@/components/organisms/hero-section"
import { ServicesSection } from "@/components/organisms/services-section"
import { HowItWorksSection } from "@/components/organisms/how-it-works-section"
import { PromoBanner } from "@/components/organisms/promo-banner"
import { TrustSection } from "@/components/organisms/trust-section"
import { Footer } from "@/components/organisms/footer"

interface HomeTemplateProps {
  children?: React.ReactNode
}

export function HomeTemplate({ children }: HomeTemplateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ServicesSection />
        <PromoBanner />
        <TrustSection />
        {children}
      </main>
      <Footer />
    </div>
  )
}
