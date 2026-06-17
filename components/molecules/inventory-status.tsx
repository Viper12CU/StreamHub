import { Icon } from "@/components/atoms/icon"

interface InventoryItem {
  platform: string
  label: string
  count: number
  color: string
  accentClass: string
  isLow?: boolean
}

const inventoryItems: InventoryItem[] = [
  { platform: "netflix", label: "Cuentas Netflix", count: 542, color: "text-green-400", accentClass: "platform-accent-netflix" },
  { platform: "spotify", label: "Perfiles Spotify", count: 236, color: "text-secondary", accentClass: "platform-accent-spotify" },
  { platform: "disney", label: "Códigos Disney+", count: 4, color: "text-error", accentClass: "platform-accent-disney", isLow: true },
  { platform: "youtube", label: "Códigos Activación", count: 89, color: "text-on-surface", accentClass: "platform-accent-youtube" },
]

const lowStockItems = [
  { name: "Disney+ Premium", count: 4, threshold: 5 },
  { name: "HBO Max Ultra", count: 3, threshold: 5 },
]

export function InventoryStatus() {
  return (
    <div className="glass p-6 rounded-xl lg:col-span-4">
      <h3 className="text-2xl font-semibold text-on-surface mb-4">Inventario</h3>
      <div className="space-y-3">
        {inventoryItems.map((item) => (
          <div key={item.platform} className={`flex items-center justify-between p-3 glass rounded-lg ${item.accentClass}`}>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{item.label}</p>
              {item.isLow && (
                <Icon name="alert" className="text-sm text-error" />
              )}
            </div>
            <span className={`text-[10px] font-bold ${item.isLow ? "text-error" : item.color}`}>{item.count}</span>
          </div>
        ))}
      </div>
      {lowStockItems.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-error-container/10 border border-error/20">
          <p className="text-xs font-semibold text-error mb-2 flex items-center gap-1">
            <Icon name="alert" className="text-sm" />
            Stock Bajo (&lt; 5 unidades)
          </p>
          {lowStockItems.map((item) => (
            <div key={item.name} className="flex justify-between text-[10px] text-on-surface-variant py-1">
              <span>{item.name}</span>
              <span className="text-error font-semibold">{item.count} restantes</span>
            </div>
          ))}
        </div>
      )}
      <button className="w-full mt-4 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors">
        Gestionar Inventario
      </button>
    </div>
  )
}
