"use client"

import { type MutableRefObject } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Mousewheel } from "swiper/modules"
import type { Swiper as SwiperClass } from "swiper"
import type { HeroSlide } from "@/components/data/hero-slider-data"

export function DestinationCards({
  slides,
  activeIndex,
  onSlideChange,
  setCardRef,
  onCardClick,
  onCardSelect,
  swiperRef,
}: {
  slides: HeroSlide[]
  activeIndex: number
  onSlideChange: (index: number) => void
  setCardRef: (index: number, el: HTMLDivElement | null) => void
  onCardClick: (index: number) => void
  onCardSelect: (index: number) => void
  swiperRef: MutableRefObject<SwiperClass | null>
}) {
  return (
    <div className="w-full lg:w-[360px]">
      <Swiper
        modules={[Autoplay, Mousewheel]}
        direction="vertical"
        slidesPerView={3.3}
        spaceBetween={10}
        loop
        speed={900}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        mousewheel={{ forceToAxis: true, sensitivity: 1.2 }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
        className="h-[420px] md:h-[520px] lg:h-[660px] py-4"
        breakpoints={{
          0: { slidesPerView: 1, direction: "horizontal", spaceBetween: 16 },
          768: { slidesPerView: 2.2, direction: "vertical", spaceBetween: 20 },
          1024: { slidesPerView: 3.2, direction: "vertical", spaceBetween: 24 },
          1280: { slidesPerView: 3.7, direction: "vertical", spaceBetween: 28 },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <button
              type="button"
              onClick={() => {
                onCardSelect(index)
                onCardClick(index)
              }}
              className="w-full text-left"
            >
              <div
                ref={(el) => setCardRef(index, el)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl shadow-black/30 transition-transform will-change-transform [transform-style:preserve-3d]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                  {slide.subtitle}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  {slide.name}
                </h3>
                <p className="mt-3 text-sm text-white/60">
                  {slide.description}
                </p>
                <div
                  className={`mt-6 h-[2px] w-12 rounded-full ${
                    activeIndex === index ? "bg-white" : "bg-white/30"
                  }`}
                />
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
