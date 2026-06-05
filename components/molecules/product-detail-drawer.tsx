"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { StatusBadge } from "@/components/atoms/status-badge"

interface ProductDetailDrawerProps {
  productId: string
  onClose: () => void
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

const productData = {
  name: "Netflix Premium 4K",
  description: "Cuenta completa de Netflix con soporte para 4K UHD y 4 pantallas simultáneas. Incluye acceso a todo el catálogo de contenido original y licenciado.",
  platform: "Netflix",
  category: "Streaming",
  type: "Cuenta Completa",
  price: "$24.99",
  costPrice: "$12.00",
  margin: "52%",
  availableUnits: 52,
  reservedUnits: 8,
  soldUnits: 438,
  totalRevenue: "$10,945",
  totalOrders: 438,
  conversionRate: "3.2%",
  status: "active",
  lastUpdated: "Hace 2 horas",
  thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=120&h=120&fit=crop",
}

export function ProductDetailDrawer({ productId, onClose }: ProductDetailDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const drawerContent = (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest border-l border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl">
          <h2 className="text-base font-semibold text-on-surface">Detalle del Producto</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            {/* Product Header */}
            <div className="flex items-start gap-4">
              <img
                src={productData.thumbnail}
                alt={productData.name}
                className="w-16 h-16 rounded-xl object-cover bg-surface-container-low"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-on-surface">{productData.name}</h3>
                  <StatusBadge status="Activo" variant="success" />
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{productData.description}</p>
              </div>
            </div>

            {/* Basic Information */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">info</span>
                Información Básica
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Plataforma", value: productData.platform },
                  { label: "Categoría", value: productData.category },
                  { label: "Tipo", value: productData.type },
                  { label: "Última Actualización", value: productData.lastUpdated },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">payments</span>
                Precios
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Venta</p>
                  <p className="text-lg font-bold text-on-surface mt-1">{productData.price}</p>
                </div>
                <div className="text-center p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Costo</p>
                  <p className="text-lg font-bold text-on-surface mt-1">{productData.costPrice}</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-[10px] text-primary uppercase tracking-wider">Margen</p>
                  <p className="text-lg font-bold text-primary mt-1">{productData.margin}</p>
                </div>
              </div>
            </section>

            {/* Inventory */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">inventory_2</span>
                Inventario
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-[10px] text-green-400 uppercase tracking-wider">Disponibles</p>
                  <p className="text-lg font-bold text-green-400 mt-1">{productData.availableUnits}</p>
                </div>
                <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-[10px] text-amber-500 uppercase tracking-wider">Reservados</p>
                  <p className="text-lg font-bold text-amber-500 mt-1">{productData.reservedUnits}</p>
                </div>
                <div className="text-center p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Vendidos</p>
                  <p className="text-lg font-bold text-on-surface mt-1">{productData.soldUnits}</p>
                </div>
              </div>
            </section>

            {/* Sales Performance */}
            <section className="glass rounded-xl p-4">
              <h4 className="text-xs font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
                Rendimiento de Ventas
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-[10px] text-primary uppercase tracking-wider">Ingresos</p>
                  <p className="text-lg font-bold text-primary mt-1">{productData.totalRevenue}</p>
                </div>
                <div className="text-center p-3 bg-surface-container-low rounded-lg">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Órdenes</p>
                  <p className="text-lg font-bold text-on-surface mt-1">{productData.totalOrders}</p>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-[10px] text-secondary uppercase tracking-wider">Conversión</p>
                  <p className="text-lg font-bold text-secondary mt-1">{productData.conversionRate}</p>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="mt-4 h-20 relative bg-surface-container-low rounded-lg overflow-hidden">
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e50914" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#e50914" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 L15,70 L30,75 L45,50 L60,40 L75,30 L90,15 L100,10" fill="none" stroke="#e50914" strokeWidth="2" />
                  <path d="M0,80 L15,70 L30,75 L45,50 L60,40 L75,30 L90,15 L100,10 L100,100 L0,100 Z" fill="url(#chartGradient)" />
                </svg>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-surface-container-lowest/90 backdrop-blur-xl space-y-3">
          {/* Primary Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">edit</span>
              Editar Producto
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5">
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Duplicar
            </button>
          </div>
          {/* Secondary Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-xl hover:bg-surface-container-low transition-colors border border-white/5">
              <span className="material-symbols-outlined text-sm">archive</span>
              Archivar
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-error/10 text-error text-xs font-semibold rounded-xl hover:bg-error/20 transition-colors border border-error/20">
              <span className="material-symbols-outlined text-sm">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null

  return createPortal(drawerContent, document.body)
}
