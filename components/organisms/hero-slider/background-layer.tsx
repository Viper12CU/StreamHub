import Image from "next/image"
import type { HeroSlide } from "@/components/data/hero-slider-data"

export function BackgroundLayer({
  slide,
  index,
  setRef,
  isPriority,
}: {
  slide: HeroSlide
  index: number
  setRef: (el: HTMLDivElement | null) => void
  isPriority: boolean
}) {
  return (
    <div
      ref={setRef}
      className="absolute inset-0 opacity-0 will-change-transform transform-gpu"
    >
      <Image
        src={slide.image}
        alt={slide.name}
        fill
        priority={isPriority}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40" />
    </div>
  )
}
