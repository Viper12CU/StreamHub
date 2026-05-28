import Image from "next/image"

const floatingLogos = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    alt: "Netflix",
    className: "w-24 h-24 top-1/4 left-1/4",
    delay: "0s"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    alt: "Spotify",
    className: "w-20 h-20 top-1/3 right-1/4",
    delay: "1.5s"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    alt: "Disney+",
    className: "w-28 h-28 bottom-1/4 left-1/3",
    delay: "3s"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
    alt: "HBO Max",
    className: "w-20 h-20 bottom-1/3 right-1/3",
    delay: "4.5s"
  }
]

export function FloatingLogos() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      {floatingLogos.map((logo) => (
        <div 
          key={logo.alt}
          className={`absolute service-logo-float ${logo.className}`}
          style={{ animationDelay: logo.delay }}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={100}
            height={100}
            className="object-contain grayscale brightness-150 invert"
          />
        </div>
      ))}
    </div>
  )
}
