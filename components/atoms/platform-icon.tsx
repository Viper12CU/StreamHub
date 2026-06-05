interface PlatformIconProps {
  platform: string
  size?: "sm" | "md"
}

const platformColors: Record<string, string> = {
  netflix: "#E50914",
  spotify: "#1DB954",
  disney: "#006E99",
  youtube: "#FF0000",
  hbo: "#991bfa",
}

const platformLetters: Record<string, string> = {
  netflix: "N",
  spotify: "S",
  disney: "D",
  youtube: "Y",
  hbo: "H",
}

export function PlatformIcon({ platform, size = "md" }: PlatformIconProps) {
  const color = platformColors[platform] || "#717373"
  const letter = platformLetters[platform] || platform[0]?.toUpperCase()
  const sizeClass = size === "sm" ? "w-6 h-6 text-[8px]" : "w-8 h-8 text-[10px]"

  return (
    <div
      className={`${sizeClass} rounded-md flex items-center justify-center text-white font-black italic`}
      style={{ backgroundColor: color }}
    >
      {letter}
    </div>
  )
}
