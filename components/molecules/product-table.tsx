"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"

interface Product {
  id: string
  name: string
  description: string
  platform: string
  type: string
  price: string
  inventory: number
  sales: number
  revenue: string
  status: "active" | "draft" | "archived" | "out_of_stock"
  lastUpdated: string
  thumbnail: string
}

interface ProductTableProps {
  selectedProducts: string[]
  onSelectProducts: (ids: string[]) => void
  onViewProduct: (id: string) => void
}

const products: Product[] = [
  { id: "PROD-001", name: "Netflix Premium 4K", description: "Cuenta completa con 4 pantallas simultáneas", platform: "Netflix", type: "Cuenta Completa", price: "$24.99", inventory: 52, sales: 438, revenue: "$10,945", status: "active", lastUpdated: "Hace 2h", thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=100&h=100&fit=crop" },
  { id: "PROD-002", name: "Spotify Family", description: "Hasta 6 cuentas Premium", platform: "Spotify", type: "Perfil Compartido", price: "$15.99", inventory: 34, sales: 312, revenue: "$4,989", status: "active", lastUpdated: "Hace 4h", thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop" },
  { id: "PROD-003", name: "Disney+ Premium", description: "Acceso completo con 4K UHD", platform: "Disney+", type: "Cuenta Completa", price: "$12.99", inventory: 3, sales: 198, revenue: "$2,572", status: "active", lastUpdated: "Hace 6h", thumbnail: "https://images.unsplash.com/photo-1585959629489-d315be2a599c?w=100&h=100&fit=crop" },
  { id: "PROD-004", name: "YouTube Premium", description: "Sin anuncios + YouTube Music", platform: "YouTube Premium", type: "Suscripción", price: "$11.99", inventory: 0, sales: 156, revenue: "$1,870", status: "out_of_stock", lastUpdated: "Hace 1d", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop" },
  { id: "PROD-005", name: "HBO Max Ultra", description: "4K + Descarga offline", platform: "HBO Max", type: "Cuenta Completa", price: "$14.99", inventory: 28, sales: 142, revenue: "$2,129", status: "active", lastUpdated: "Hace 12h", thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=100&h=100&fit=crop" },
  { id: "PROD-006", name: "Crunchyroll Mega", description: "Acceso completo a anime", platform: "Crunchyroll", type: "Cuenta Completa", price: "$7.99", inventory: 45, sales: 98, revenue: "$783", status: "active", lastUpdated: "Hace 2d", thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&h=100&fit=crop" },
  { id: "PROD-007", name: "Netflix Standard", description: "2 pantallas simultáneas", platform: "Netflix", type: "Perfil Compartido", price: "$8.99", inventory: 67, sales: 289, revenue: "$2,598", status: "active", lastUpdated: "Hace 3d", thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=100&h=100&fit=crop" },
  { id: "PROD-008", name: "Spotify Individual", description: "Cuenta Premium individual", platform: "Spotify", type: "Cuenta Completa", price: "$9.99", inventory: 89, sales: 234, revenue: "$2,337", status: "active", lastUpdated: "Hace 3d", thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop" },
  { id: "PROD-009", name: "IPTV Premium", description: "10,000+ canales en vivo", platform: "IPTV", type: "Código de Activación", price: "$19.99", inventory: 12, sales: 87, revenue: "$1,739", status: "active", lastUpdated: "Hace 4d", thumbnail: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=100&h=100&fit=crop" },
  { id: "PROD-010", name: "Disney+ + ESPN", description: "Paquete combo deportes", platform: "Disney+", type: "Paquete de Suscripción", price: "$16.99", inventory: 2, sales: 145, revenue: "$2,464", status: "active", lastUpdated: "Hace 5d", thumbnail: "https://images.unsplash.com/photo-1585959629489-d315be2a599c?w=100&h=100&fit=crop" },
]

const platformColors: Record<string, string> = {
  Netflix: "bg-primary-container",
  Spotify: "bg-secondary",
  "YouTube Premium": "bg-[#ff0000]",
  "HBO Max": "bg-[#b829e3]",
  "Disney+": "bg-tertiary",
  Crunchyroll: "bg-[#f47521]",
  IPTV: "bg-amber-500",
}

const statusMap = {
  active: { label: "Activo", variant: "success" as const },
  draft: { label: "Borrador", variant: "neutral" as const },
  archived: { label: "Archivado", variant: "neutral" as const },
  out_of_stock: { label: "Sin Stock", variant: "error" as const },
}

function getInventoryColor(count: number) {
  if (count > 20) return "text-green-400"
  if (count >= 5) return "text-amber-500"
  return "text-error"
}

export function ProductTable({ selectedProducts, onSelectProducts, onViewProduct }: ProductTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectProducts([])
    } else {
      onSelectProducts(products.map((p) => p.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = selectedProducts.includes(id)
      ? selectedProducts.filter((pid) => pid !== id)
      : [...selectedProducts, id]
    onSelectProducts(updated)
    setSelectAll(updated.length === products.length)
  }

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-base font-semibold text-on-surface">Catálogo de Productos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded accent-primary"
                />
              </th>
              <th className="py-3">Producto</th>
              <th className="py-3">Plataforma</th>
              <th className="py-3">Tipo</th>
              <th className="py-3 text-right">Precio</th>
              <th className="py-3 text-right">Inventario</th>
              <th className="py-3 text-right">Ventas</th>
              <th className="py-3 text-right">Ingresos</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => onViewProduct(product.id)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => handleSelectProduct(e, product.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-primary"
                  />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-surface-container-low"
                    />
                    <div>
                      <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">{product.name}</p>
                      <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", platformColors[product.platform] || "bg-surface-container-highest")} />
                    <span className="text-xs text-on-surface-variant">{product.platform}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-on-surface-variant">{product.type}</td>
                <td className="py-3 text-xs font-semibold text-on-surface text-right">{product.price}</td>
                <td className="py-3 text-right">
                  <span className={cn("text-xs font-semibold", getInventoryColor(product.inventory))}>
                    {product.inventory} {product.inventory === 1 ? "Unidad" : "Unidades"}
                  </span>
                </td>
                <td className="py-3 text-xs text-on-surface text-right">{product.sales}</td>
                <td className="py-3 text-xs font-semibold text-primary text-right">{product.revenue}</td>
                <td className="py-3">
                  <StatusBadge
                    status={statusMap[product.status].label}
                    variant={statusMap[product.status].variant}
                  />
                </td>
                <td className="py-3 text-[10px] text-on-surface-variant">{product.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">Mostrando {products.length} de 145 productos</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 bg-primary text-on-primary text-[10px] font-semibold rounded-lg">1</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">2</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">3</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">...</button>
          <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors">15</button>
        </div>
      </div>
    </div>
  )
}
