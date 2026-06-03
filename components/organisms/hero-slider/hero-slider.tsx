"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { heroSlides } from "@/components/data/hero-slider-data"
import { BackgroundLayer } from "./background-layer"
import { AnimatedContent } from "./animated-content"
import { DestinationCards } from "./destination-cards"

export function HeroSlider() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const prevIndex = useRef(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const backgroundRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const swiperRef = useRef<import("swiper").Swiper | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(backgroundRefs.current, { autoAlpha: 0, scale: 1.05 })
      gsap.set(backgroundRefs.current[0], { autoAlpha: 1, scale: 1 })
      gsap.set(textRefs.current, { autoAlpha: 0, y: 26, filter: "blur(6px)" })
      gsap.set(textRefs.current[0], { autoAlpha: 1, y: 0, filter: "blur(0px)" })

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        gsap.set(card, {
          scale: index === 0 ? 1 : 0.92,
          opacity: index === 0 ? 1 : 0.6,
          y: index === 0 ? 0 : 12,
          filter: index === 0 ? "blur(0px)" : "blur(2px)",
        })
      })

      if (floatingRef.current) {
        gsap.to(floatingRef.current, {
          y: -10,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }
    }, sliderRef)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    if (prevIndex.current === activeIndex) return

    const current = prevIndex.current
    const next = activeIndex

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power4.out" },
    })

    tl.to(
      backgroundRefs.current[current],
      { scale: 1.08, autoAlpha: 0, filter: "blur(4px)" },
      0
    )
    tl.fromTo(
      backgroundRefs.current[next],
      { scale: 1.15, autoAlpha: 0, filter: "blur(8px)" },
      {
        scale: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "expo.out",
      },
      0
    )

    tl.to(
      textRefs.current[current],
      { y: -18, autoAlpha: 0, filter: "blur(6px)" },
      0
    )
    tl.fromTo(
      textRefs.current[next],
      { y: 30, autoAlpha: 0, filter: "blur(6px)" },
      { y: 0, autoAlpha: 1, filter: "blur(0px)", stagger: 0.06 },
      0.2
    )

    tl.add(() => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return
        gsap.to(card, {
          duration: 0.8,
          ease: "power4.out",
          scale: index === next ? 1 : 0.92,
          opacity: index === next ? 1 : 0.6,
          y: index === next ? 0 : 12,
          filter: index === next ? "blur(0px)" : "blur(2px)",
        })
      })
    }, 0.1)

    prevIndex.current = activeIndex

    return () => {
      tl.kill()
    }
  }, [activeIndex])

  return (
    <section
      id="catalogo"
      ref={sliderRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <BackgroundLayer
            key={slide.id}
            slide={slide}
            index={index}
            isPriority={index === 0}
            setRef={(el) => {
              backgroundRefs.current[index] = el
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-12 pt-28 md:px-12 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1">
          <div className="max-w-xl">
            <AnimatedContent
              slides={heroSlides}
              setRef={(index, el) => {
                textRefs.current[index] = el
              }}
            />
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/catalog")}
                className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.35em] text-white/80 hover:bg-white/10 transition-colors"
              >
                Ver catalogo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex w-full flex-col items-center gap-6 lg:mt-0 lg:w-auto lg:items-end">
          <DestinationCards
            slides={heroSlides}
            activeIndex={activeIndex}
            swiperRef={swiperRef}
            onSlideChange={(index) => setActiveIndex(index)}
            setCardRef={(index, el) => {
              cardRefs.current[index] = el
            }}
            onCardClick={(index) => {
              swiperRef.current?.slideToLoop(index)
            }}
            onCardSelect={(index) => setActiveIndex(index)}
          />
        </div>
      </div>
    </section>
  )
}
