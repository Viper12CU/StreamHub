const lowStockProducts = [
  { name: "Disney+ Premium", stock: 3, threshold: 5 },
  { name: "HBO Max Ultra", stock: 2, threshold: 5 },
  { name: "IPTV Premium", stock: 12, threshold: 10 },
]

const outOfStockProducts = [
  { name: "YouTube Premium" },
  { name: "Spotify Duo" },
]

const mostStockedProducts = [
  { name: "Spotify Individual", stock: 89 },
  { name: "Netflix Standard", stock: 67 },
  { name: "Netflix Premium 4K", stock: 52 },
]

export function InventoryInsights() {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-sm text-primary">inventory_2</span>
        Salud del Inventario
      </h3>

      {/* Products Running Low */}
      <div>
        <p className="text-[10px] text-on-surface-variant uppercase mb-2">Stock Bajo</p>
        <div className="space-y-2">
          {lowStockProducts.map((product) => (
            <div key={product.name} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
              <span className="text-xs text-on-surface">{product.name}</span>
              <span className="text-[10px] font-semibold text-amber-500">{product.stock} unidades</span>
            </div>
          ))}
        </div>
      </div>

      {/* Out of Stock */}
      <div>
        <p className="text-[10px] text-on-surface-variant uppercase mb-2">Sin Stock</p>
        <div className="space-y-2">
          {outOfStockProducts.map((product) => (
            <div key={product.name} className="flex items-center justify-between p-2 bg-error/10 rounded-lg">
              <span className="text-xs text-on-surface">{product.name}</span>
              <span className="text-[10px] font-semibold text-error">Reponer</span>
            </div>
          ))}
        </div>
      </div>

      {/* Most Stocked */}
      <div>
        <p className="text-[10px] text-on-surface-variant uppercase mb-2">Mayor Stock</p>
        <div className="space-y-2">
          {mostStockedProducts.map((product) => (
            <div key={product.name} className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
              <span className="text-xs text-on-surface">{product.name}</span>
              <span className="text-[10px] font-semibold text-green-400">{product.stock} unidades</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
