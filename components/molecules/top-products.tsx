interface Product {
  rank: number
  name: string
  platform: string
  sales: number
  revenue: string
}

const products: Product[] = [
  { rank: 1, name: "Netflix Premium 4K", platform: "Netflix", sales: 142, revenue: "$3,547" },
  { rank: 2, name: "Spotify Family", platform: "Spotify", sales: 89, revenue: "$1,779" },
  { rank: 3, name: "YouTube Premium", platform: "YouTube", sales: 64, revenue: "$767" },
  { rank: 4, name: "HBO Max Ultra", platform: "HBO Max", sales: 51, revenue: "$764" },
  { rank: 5, name: "Disney+ Premium", platform: "Disney+", sales: 48, revenue: "$623" },
  { rank: 6, name: "Netflix Standard", platform: "Netflix", sales: 45, revenue: "$809" },
  { rank: 7, name: "Spotify Individual", platform: "Spotify", sales: 42, revenue: "$419" },
  { rank: 8, name: "Crunchyroll Mega", platform: "Crunchyroll", sales: 38, revenue: "$303" },
  { rank: 9, name: "Disney+ + ESPN", platform: "Disney+", sales: 35, revenue: "$594" },
  { rank: 10, name: "YouTube Premium Fam", platform: "YouTube", sales: 29, revenue: "$347" },
]

const platformColors: Record<string, string> = {
  Netflix: "bg-primary-container",
  Spotify: "bg-secondary",
  YouTube: "bg-[#ff0000]",
  "HBO Max": "bg-[#b829e3]",
  "Disney+": "bg-tertiary",
  Crunchyroll: "bg-[#f47521]",
}

export function TopProducts() {
  return (
    <div className="glass p-6 rounded-xl lg:col-span-5">
      <h3 className="text-2xl font-semibold text-on-surface mb-4">Top Productos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="pb-2 pr-2">#</th>
              <th className="pb-2 pr-2">Producto</th>
              <th className="pb-2 pr-2">Plataforma</th>
              <th className="pb-2 pr-2 text-right">Ventas</th>
              <th className="pb-2 text-right">Ingresos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.rank} className="hover:bg-white/5 transition-colors">
                <td className="py-2 text-xs text-on-surface-variant">{product.rank}</td>
                <td className="py-2 text-xs font-semibold text-on-surface">{product.name}</td>
                <td className="py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${platformColors[product.platform] || "bg-surface-container-highest"}`} />
                    <span className="text-[10px] text-on-surface-variant">{product.platform}</span>
                  </div>
                </td>
                <td className="py-2 text-xs font-semibold text-primary text-right">{product.sales}</td>
                <td className="py-2 text-xs text-on-surface-variant text-right">{product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
