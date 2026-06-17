import { VerifiedBadge } from "@/components/molecules/verified-badge"
import { FeatureBadge } from "@/components/molecules/feature-badge"
import { Button } from "@/components/atoms/button"

export function HeroSection() {
  return (
    <section className="pt-32 px-4 md:px-6">
      <div className="max-w-10xl mx-auto relative min-h-[800px] flex items-center overflow-hidden hero-gradient rounded-3xl md:rounded-[3rem] border border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 py-16 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <VerifiedBadge label="SERVICIO #1 EN CUBA" />

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
              Tu acceso a <span className="text-primary">Netflix</span>, Spotify y más — directo desde Cuba.
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Cuentas, perfiles y códigos de activación. Entrega inmediata con garantía premium de 30 días.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <a href="#catalogo">
                <Button size="lg" className="min-w-[180px] rounded-2xl hover:scale-105">
                  Ver Catálogo
                </Button>
              </a>
              <a href="#how">
                <Button
                  variant="secondary"
                  size="lg"
                  className="min-w-[180px] rounded-2xl text-foreground"
                >
                  ¿Cómo funciona?
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap gap-6 pt-10 border-t border-white/10">
              <FeatureBadge icon="shield" label="Pago seguro" />
              <FeatureBadge icon="flash" label="Entrega inmediata" />
              <FeatureBadge icon="shield-check" label="Garantía de 30 días" />
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative z-10 bg-black/40 backdrop-blur-md p-4 rounded-[2rem] border border-white/10 overflow-hidden aspect-video shadow-2xl">
              <img
                alt="StreamHub Hero"
                className="w-full h-full object-cover rounded-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCavkOs2_rMi34x30m9oQ_qvLVJIBTTkfcKLjlJj8Lwd9xvGFqfUU3hh1gX_LKuTch8BoIAyIWIIh1U60rP8tydYsxVgs9zFWP87x8TAT6q67NdM9YSakbf39SKXtdL1nr-uEmoYZhG3aZhA_8-83dslNqmG008rpU3O_2G9MkrxsQ-i9SNRkDZTKAYvCAaavgZ8vuCUwSULTTwnc9DiL4DKqqU27COUhO40tzm7YOAWVIgR_r-m_0BFO8MNcj9N4KzZ3L_tVBfnw"
              />
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-slate-500" />
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-slate-400" />
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-slate-300" />
                </div>
                <div className="text-xs font-semibold text-white">+500 Clientes Felices</div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 glass-panel p-3 px-6 rounded-2xl animate-bounce-slow shadow-xl border border-primary/30 z-20">
              <span className="text-primary font-black">Netflix 4K</span>
            </div>
            <div className="absolute -bottom-6 -left-6 glass-panel p-3 px-6 rounded-2xl animate-bounce-slower shadow-xl border border-secondary/30 z-20">
              <span className="text-secondary font-black">Spotify Premium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
