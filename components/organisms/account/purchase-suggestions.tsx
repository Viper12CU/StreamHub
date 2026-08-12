'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/atoms/icon'
import { getProducts, type ProductWithDetails } from '@/lib/api/products'
import type { Product } from '@/components/molecules/product-card'

function mapToCardProduct(p: ProductWithDetails): Product {
  return {
    id: p.id,
    name: p.name,
    image: p.image_url || p.thumbnail || '',
    accessType: p.product_type,
    priceValue: p.price_sale,
    brandColor: p.platform_color,
    slug: p.slug,
    platformName: p.platform_name,
    platformSlug: p.platform_slug,
    description: p.description || undefined,
    availableUnits: p.available_units,
  }
}

export function PurchaseSuggestions() {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Product[]>([])

  useEffect(() => {
    getProducts({ status: 'active', inventory_status: 'available' }, 1, 3)
      .then((res) => setSuggestions(res.data.map(mapToCardProduct)))
      .catch(() => {})
  }, [])

  if (suggestions.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="tag" className="text-primary" />
          Sugerencias para ti
        </h2>
        <Link
          href="/web/catalog"
          className="text-xs uppercase tracking-[0.2em] text-primary hover:underline"
        >
          Ver todo
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              router.push(`/web/product/${product.slug}`)
            }}
            className={cn(
              'glass-panel rounded-xl overflow-hidden text-left group',
              'hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)]',
              'transition-all duration-300 border-t-2'
            )}
            style={{ borderTopColor: product.brandColor }}
          >
            <div className="relative h-32 overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-[var(--surface-container-high)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  ${product.priceValue} USD
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Ver mas
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
