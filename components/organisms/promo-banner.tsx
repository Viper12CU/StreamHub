import Link from "next/link"
import { Button } from "@/components/atoms/button"

export function PromoBanner() {
  return (
    <section className="py-16 px-4 md:px-10" id="promo">
      <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden relative bg-gradient-to-r from-primary/90 to-secondary/90 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {/* Left Content */}
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <div className="bg-white/20 backdrop-blur px-4 py-1 rounded-full inline-block text-white font-bold text-xs uppercase tracking-wide">
            OFERTA LIMITADA
          </div>
          <h2 className="text-5xl font-extrabold text-white tracking-tight">
            Combo Netflix + Spotify
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Disfruta de todo el cine y toda la música por un precio especial. ¡Ahorra un 20% al contratarlos juntos!
          </p>
        </div>
        
        {/* Right Content - Pricing */}
        <div className="relative z-10 text-center md:text-right space-y-6">
          <div className="text-white">
            <span className="text-base line-through opacity-60">$400</span>
            <div className="text-7xl font-black tracking-tight leading-none">
              $320 <span className="text-2xl">MLC</span>
            </div>
          </div>
          <Link href="/web/checkout">
            <Button
              variant="ghost"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              Lo quiero ahora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
