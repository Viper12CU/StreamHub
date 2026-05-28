import { SectionTitle } from "@/components/atoms/section-title"
import { StepCard } from "@/components/molecules/step-card"
import { MousePointerClick, Wallet, Mail } from "lucide-react"

const steps = [
  {
    stepNumber: 1,
    title: "Elige",
    description: "Selecciona el servicio y el plan que mejor se adapte a tus necesidades.",
    icon: MousePointerClick,
    variant: "primary" as const,
  },
  {
    stepNumber: 2,
    title: "Paga",
    description: "Aceptamos Transfermóvil, Zelle y depósitos en MLC. Rápido y sin complicaciones.",
    icon: Wallet,
    variant: "secondary" as const,
  },
  {
    stepNumber: 3,
    title: "Recibe",
    description: "Recibe tus credenciales vía WhatsApp o Correo en menos de 15 minutos.",
    icon: Mail,
    variant: "primary" as const,
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16" id="how">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <SectionTitle 
          title="¿Cómo funciona?"
          subtitle="Proceso rápido, transparente y 100% digital desde la comodidad de tu casa."
        />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-16">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-10 left-1/4 w-1/6 h-[2px] bg-gradient-to-r from-primary to-secondary opacity-30" />
          <div className="hidden md:block absolute top-10 right-1/4 w-1/6 h-[2px] bg-gradient-to-r from-secondary to-primary opacity-30" />
          
          {steps.map((step) => (
            <StepCard key={step.stepNumber} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
