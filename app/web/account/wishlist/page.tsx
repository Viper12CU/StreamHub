'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { Icon } from '@/components/atoms/icon'
import { getMyWishlist, removeFromWishlist, type WishlistItem } from '@/lib/api/wishlist'
import { sileo } from 'sileo'

export default function AccountWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyWishlist()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
      setItems((prev) => prev.filter((i) => i.product_id !== productId))
      sileo.success({ title: 'Eliminado', description: 'Producto removido de tu wishlist.' })
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar de la wishlist.' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="heart" className="text-red-400" /> Wishlist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="h-48 animate-pulse">&nbsp;</GlassCard>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Icon name="heart" className="text-red-400" /> Wishlist
          </h2>
          <p className="text-sm text-[var(--on-surface-variant)]">
            Guarda servicios para comprar mas tarde. Aun no tienes elementos en tu wishlist.
          </p>
          <Link
            href="/web/catalog"
            className="inline-block text-xs uppercase tracking-[0.2em] text-primary hover:underline"
          >
            Explorar catalogo
          </Link>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="heart" className="text-red-400" /> Wishlist
        <span className="text-sm font-normal text-[var(--on-surface-variant)]">({items.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: item.platform_color || '#666' }} />
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--on-surface-variant)]">
                    {item.platform_name}
                  </p>
                  <h3 className="text-sm font-semibold mt-1">{item.product_name}</h3>
                </div>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                  title="Eliminar de wishlist"
                >
                  <Icon name="heart-off" className="text-[18px]" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${item.product_price_sale} USD</span>
                <Link
                  href={`/web/product/${item.product_slug}`}
                  className="text-xs uppercase tracking-[0.15em] text-primary hover:underline"
                >
                  Ver producto
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
