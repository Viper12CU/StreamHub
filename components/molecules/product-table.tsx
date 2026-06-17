"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/atoms/status-badge"
import { Icon } from "@/components/atoms/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { statusMap, productTypeMap, getInventoryColor, formatRelativeDate } from "@/lib/constants/products"
import type { ProductWithDetails } from "@/lib/api/products"

interface ProductTableProps {
  products: ProductWithDetails[]
  loading: boolean
  pagination: { page: number; totalPages: number; total: number }
  selectedProducts: string[]
  onSelectProducts: (ids: string[]) => void
  onViewProduct: (id: string) => void
  onPageChange: (page: number) => void
  viewMode?: "grid" | "table"
}

function TableSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5">
      <div className="p-4 border-b border-white/5">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-[10px] font-semibold text-on-surface-variant opacity-60">
            <tr>
              <th className="py-3 px-4 w-10"><Skeleton className="h-4 w-4" /></th>
              <th className="py-3"><Skeleton className="h-3 w-24" /></th>
              <th className="py-3"><Skeleton className="h-3 w-20" /></th>
              <th className="py-3"><Skeleton className="h-3 w-20" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-12" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-14" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-10" /></th>
              <th className="py-3 text-right"><Skeleton className="h-3 w-14" /></th>
              <th className="py-3"><Skeleton className="h-3 w-14" /></th>
              <th className="py-3"><Skeleton className="h-3 w-14" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4"><Skeleton className="h-4 w-4" /></td>
                <td className="py-3"><Skeleton className="h-4 w-32" /></td>
                <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="py-3 text-right"><Skeleton className="h-4 w-12" /></td>
                <td className="py-3 text-right"><Skeleton className="h-4 w-14" /></td>
                <td className="py-3 text-right"><Skeleton className="h-4 w-10" /></td>
                <td className="py-3 text-right"><Skeleton className="h-4 w-14" /></td>
                <td className="py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="py-3"><Skeleton className="h-3 w-14" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PaginationFooter({ pagination, onPageChange }: { pagination: { page: number; totalPages: number; total: number }; onPageChange: (page: number) => void }) {
  return (
    <div className="p-4 border-t border-white/5 flex items-center justify-between">
      <span className="text-xs text-on-surface-variant">
        Mostrando {pagination.total} productos
      </span>
      {pagination.totalPages > 1 && (
        <nav className="flex gap-1" aria-label="Paginación de productos">
          {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              aria-label={`Ir a página ${i + 1}`}
              aria-current={pagination.page === i + 1 ? "page" : undefined}
              className={cn(
                "px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors",
                pagination.page === i + 1
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

function EmptyState({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <div className="glass rounded-xl p-12 border border-white/5 text-center">
      <Icon name="inventory" className="text-5xl text-on-surface-variant/30 mb-4 block" />
      <p className="text-sm font-semibold text-on-surface mb-1">No hay productos registrados</p>
      <p className="text-xs text-on-surface-variant/60 mb-4">Crea tu primer producto para comenzar a vender</p>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Icon name="plus" className="text-sm" />
          Crear Primer Producto
        </button>
      )}
    </div>
  )
}

export function ProductTable({ products, loading, pagination, selectedProducts, onSelectProducts, onViewProduct, onPageChange, viewMode = "table" }: ProductTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      onSelectProducts([])
    } else {
      onSelectProducts(products.map((p) => p.id))
    }
    setSelectAll(!selectAll)
  }, [selectAll, products, onSelectProducts])

  const handleSelectProduct = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation()
    const updated = selectedProducts.includes(id)
      ? selectedProducts.filter((pid) => pid !== id)
      : [...selectedProducts, id]
    onSelectProducts(updated)
    setSelectAll(updated.length === products.length)
  }, [selectedProducts, products.length, onSelectProducts])

  if (loading) return <TableSkeleton />
  if (products.length === 0) return <EmptyState />

  if (viewMode === "grid") {
    return (
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-on-surface">Catálogo de Productos</h3>
          <span className="text-xs text-on-surface-variant">{products.length} de {pagination.total}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onViewProduct(product.id)}
              className="glass rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: product.platform_color }}
                  >
                    {product.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{product.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{product.platform_name}</p>
                  </div>
                </div>
                <StatusBadge
                  status={statusMap[product.status]?.label || product.status}
                  variant={statusMap[product.status]?.variant || "neutral"}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase">Precio</p>
                  <p className="text-xs font-bold text-on-surface">${Number(product.price_sale).toFixed(2)}</p>
                </div>
                <div className="text-center p-2 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase">Inventario</p>
                  <p className={cn("text-xs font-bold", getInventoryColor(product.available_units))}>{product.available_units}</p>
                </div>
                <div className="text-center p-2 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase">Ingresos</p>
                  <p className="text-xs font-bold text-primary">${(product.total_revenue || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                <span>{productTypeMap[product.product_type] || product.product_type}</span>
                <span>{formatRelativeDate(product.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
        <PaginationFooter pagination={pagination} onPageChange={onPageChange} />
      </div>
    )
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
                  aria-label="Seleccionar todos los productos de esta página"
                  className="w-4 h-4 rounded accent-primary"
                />
              </th>
              <th className="py-3 px-3">Producto</th>
              <th className="py-3 px-3">Plataforma</th>
              <th className="py-3 px-3">Tipo</th>
              <th className="py-3 px-3 text-right">Precio</th>
              <th className="py-3 px-3 text-right">Inventario</th>
              <th className="py-3 px-3 text-right">Ventas</th>
              <th className="py-3 px-3 text-right">Ingresos</th>
              <th className="py-3 px-3">Estado</th>
              <th className="py-3 px-3">Actualizado</th>
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
                    aria-label={`Seleccionar ${product.name}`}
                    className="w-4 h-4 rounded accent-primary"
                  />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: product.platform_color }}
                    >
                      {product.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{product.name}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">{product.description || product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: product.platform_color }} />
                    <span className="text-xs text-on-surface-variant">{product.platform_name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs text-on-surface-variant whitespace-nowrap">{productTypeMap[product.product_type] || product.product_type}</td>
                <td className="py-3 px-3 text-xs font-semibold text-on-surface text-right whitespace-nowrap">${Number(product.price_sale).toFixed(2)}</td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <span className={cn("text-xs font-semibold", getInventoryColor(product.available_units))}>
                    {product.available_units} {product.available_units === 1 ? "Unidad" : "Unidades"}
                  </span>
                </td>
                <td className="py-3 px-3 text-xs text-on-surface text-right whitespace-nowrap">{product.sold_units}</td>
                <td className="py-3 px-3 text-xs font-semibold text-primary text-right whitespace-nowrap">${(product.total_revenue || 0).toLocaleString()}</td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <StatusBadge
                    status={statusMap[product.status]?.label || product.status}
                    variant={statusMap[product.status]?.variant || "neutral"}
                  />
                </td>
                <td className="py-3 px-3 text-[10px] text-on-surface-variant whitespace-nowrap">{formatRelativeDate(product.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationFooter pagination={pagination} onPageChange={onPageChange} />
    </div>
  )
}
