export type HeroSlide = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  image: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: "netflix-01",
    slug: "netflix",
    name: "Netflix 4K",
    subtitle: "Series y Peliculas",
    description:
      "Perfiles premium con pin, contenido 4K + HDR y acceso inmediato desde Cuba.",
    image: "/slider-hero/netflix-slider.jpg",
  },
  {
    id: "spotify-02",
    slug: "spotify",
    name: "Spotify Premium",
    subtitle: "Musica Sin Limites",
    description:
      "Modo offline, sin anuncios y audio de alta calidad para todos tus dispositivos.",
    image: "/slider-hero/spotify-slider.jpeg",
  },
  {
    id: "disney-03",
    slug: "disney",
    name: "Disney+",
    subtitle: "Familia y Estrenos",
    description:
      "Marvel, Star Wars y estrenos premium con perfiles seguros y soporte dedicado.",
    image: "/slider-hero/disney_slider.jpeg",
  },
  {
    id: "youtube-04",
    slug: "youtube",
    name: "YouTube Premium",
    subtitle: "Sin Anuncios",
    description:
      "Reproduce en segundo plano, descarga offline y disfruta YouTube Music incluido.",
    image: "/slider-hero/youtube-slider.jpeg",
  },
  {
    id: "prime-05",
    slug: "prime",
    name: "Prime Video",
    subtitle: "Exclusivas Amazon",
    description:
      "Series originales, estrenos en cine y contenido 4K con HDR Dolby Vision.",
    image: "/slider-hero/primevideo_slider.jpeg",
  },
  {
    id: "hbo-06",
    slug: "hbo",
    name: "HBO Max",
    subtitle: "Calidad Premium",
    description:
      "Todo el catálogo HBO, Warner Bros y estrenos simultáneos en pantalla.",
    image: "/slider-hero/hbo-slider.jpeg",
  },
]
