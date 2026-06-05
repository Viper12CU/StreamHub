import { GlassCard } from '@/components/ui/glass-card'

export const metadata = {
  title: 'Wishlist | StreamHub Cuba',
  description: 'Tus servicios guardados en StreamHub Cuba.',
}

export default function AccountWishlistPage() {
  return (
    <GlassCard className="p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Wishlist</h2>
        <p className="text-sm text-[var(--on-surface-variant)]">
          Guarda servicios para comprar mas tarde. Aun no tienes elementos en tu wishlist.
        </p>
      </div>
    </GlassCard>
  )
}
