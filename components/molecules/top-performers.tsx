import { cn } from "@/lib/utils"

const topProducts = [
  { rank: 1, name: "Netflix Premium 4K", platform: "Netflix", orders: 438, revenue: "$10,945", growth: "+12%" },
  { rank: 2, name: "Spotify Family", platform: "Spotify", orders: 312, revenue: "$4,989", growth: "+8%" },
  { rank: 3, name: "Netflix Standard", platform: "Netflix", orders: 289, revenue: "$2,598", growth: "+5%" },
  { rank: 4, name: "Spotify Individual", platform: "Spotify", orders: 234, revenue: "$2,337", growth: "+3%" },
  { rank: 5, name: "Disney+ Premium", platform: "Disney+", orders: 198, revenue: "$2,572", growth: "+15%" },
]

const platformColors: Record<string, string> = {
  Netflix: "bg-primary-container",
  Spotify: "bg-secondary",
  "YouTube Premium": "bg-[#ff0000]",
  "HBO Max": "bg-[#b829e3]",
  "Disney+": "bg-tertiary",
  Crunchyroll: "bg-[#f47521]",
}

export function TopPerformers() {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-primary">emoji_events</span>
        Mejores Vendedores
      </h3>
      <div className="space-y-2">
        {topProducts.map((product) => (
          <div key={product.rank} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
              product.rank === 1 ? "bg-primary text-on-primary" :
              product.rank === 2 ? "bg-secondary text-on-secondary" :
              product.rank === 3 ? "bg-amber-500 text-black" :
              "bg-surface-container-high text-on-surface-variant"
            )}>
              {product.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface truncate">{product.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", platformColors[product.platform] || "bg-surface-container-highest")} />
                <span className="text-[10px] text-on-surface-variant">{product.platform}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-on-surface">{product.orders}</p>
              <p className="text-[10px] text-on-surface-variant">{product.revenue}</p>
            </div>
            <span className="text-[10px] font-semibold text-primary">{product.growth}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
