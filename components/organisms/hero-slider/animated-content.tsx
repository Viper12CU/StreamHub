import type { HeroSlide } from "@/components/data/hero-slider-data"

export function AnimatedContent({
  slides,
  setRef,
}: {
  slides: HeroSlide[]
  setRef: (index: number, el: HTMLDivElement | null) => void
}) {
  return (
    <div className="relative min-h-[220px] md:min-h-[320px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => setRef(index, el)}
          className="absolute inset-0 opacity-0 will-change-transform"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-white/70">
            {slide.subtitle}
          </p>
          <h2 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
            {slide.name}
          </h2>
          <p className="mt-6 max-w-lg text-base md:text-lg text-white/70 leading-relaxed">
            {slide.description}
          </p>
        </div>
      ))}
    </div>
  )
}
