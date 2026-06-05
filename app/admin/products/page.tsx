"use client"

import { useState } from "react"
import { MetricCard } from "@/components/atoms/metric-card"
import { ProductFilters } from "@/components/molecules/product-filters"
import { ProductTable } from "@/components/molecules/product-table"
import { ProductDetailDrawer } from "@/components/molecules/product-detail-drawer"
import { CreateProductModal } from "@/components/molecules/create-product-modal"
import { InventoryInsights } from "@/components/molecules/inventory-insights"
import { TopPerformers } from "@/components/molecules/top-performers"
import { ProductAnalytics } from "@/components/molecules/product-analytics"

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Productos</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Administra el catálogo de productos, precios, disponibilidad y rendimiento de ventas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Producto
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 glass text-on-surface text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">upload</span>
            Importar
          </button>
        </div>
      </section>

      {/* Search & Bulk Actions */}
      <section className="glass p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar productos por nombre, plataforma, SKU o categoría..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-xl border border-white/5">
              <span className="text-xs text-on-surface-variant">{selectedProducts.length} seleccionados</span>
              <div className="w-px h-4 bg-white/10" />
              <button className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-semibold rounded-lg hover:bg-green-500/20 transition-colors">
                Activar
              </button>
              <button className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded-lg hover:bg-amber-500/20 transition-colors">
                Desactivar
              </button>
              <button className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-semibold rounded-lg hover:bg-white/5 transition-colors">
                Archivar
              </button>
              <button className="px-2.5 py-1 bg-error/10 text-error text-[10px] font-semibold rounded-lg hover:bg-error/20 transition-colors">
                Eliminar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* KPI Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Total Productos"
          description="Catálogo completo"
          value="145"
          accent="border-primary"
          icon="inventory"
          iconColor="text-primary"
        />
        <MetricCard
          label="Activos"
          description="128 Activos"
          value="128"
          accent="border-green-500"
          badge="Activo"
          badgeColor="text-green-400"
          icon="check_circle"
          iconColor="text-green-400"
        />
        <MetricCard
          label="Borradores"
          description="12 Borradores"
          value="12"
          accent="border-on-surface-variant"
          badge="Borrador"
          badgeColor="text-on-surface-variant"
          icon="edit_note"
          iconColor="text-on-surface-variant"
        />
        <MetricCard
          label="Sin Stock"
          description="Requieren reposición"
          value="5"
          accent="border-error"
          badge="Sin Stock"
          badgeColor="text-error"
          icon="warning"
          iconColor="text-error"
        />
        <MetricCard
          label="Ingresos Mensuales"
          description="+12.5% vs mes anterior"
          value="$8,420"
          accent="border-secondary"
          badge="+12.5%"
          badgeColor="text-primary"
          icon="attach_money"
          iconColor="text-secondary"
        />
      </section>

      {/* Filters */}
      <ProductFilters onToggle={() => setShowFilters(!showFilters)} isOpen={showFilters} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Products Table */}
        <div className="lg:col-span-8">
          <ProductTable
            selectedProducts={selectedProducts}
            onSelectProducts={setSelectedProducts}
            onViewProduct={setSelectedProduct}
          />
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-5">
          <InventoryInsights />
          <TopPerformers />
        </div>
      </div>

      {/* Analytics */}
      <ProductAnalytics />

      {/* Modals & Drawers */}
      {showCreateModal && <CreateProductModal onClose={() => setShowCreateModal(false)} />}
      {selectedProduct && (
        <ProductDetailDrawer productId={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
