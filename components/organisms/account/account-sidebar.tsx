'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/account', label: 'Inicio', icon: 'dashboard' },
  { href: '/account/purchases', label: 'Mis Compras', icon: 'shopping_bag' },
  { href: '/account/active-services', label: 'Servicios Activos', icon: 'subscriptions' },
  { href: '/account/wishlist', label: 'Wishlist', icon: 'favorite' },
  { href: '/account/settings', label: 'Configuracion', icon: 'settings' },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-[260px] flex-col fixed h-full z-40 bg-[var(--surface-container-lowest)] border-r border-white/5">
      <div className="p-6 space-y-8">
        <span className="font-black text-2xl text-primary tracking-tight">StreamHub</span>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-container-low)] border border-white/5">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-container-high)] ring-2 ring-primary/30" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Jorge Garcia</p>
            <p className="text-xs text-[var(--on-surface-variant)] truncate">jorge.g@email.com</p>
          </div>
        </div>
        <nav className="space-y-2 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-r-lg transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10 border-l-4 border-primary'
                    : 'text-[var(--on-surface-variant)] hover:text-primary',
                )}
              >
                <span className="material-symbols-outlined text-[20px]" data-icon={item.icon}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <Button variant="secondary" className="w-full rounded-2xl text-primary border border-white/10">
          <span className="material-symbols-outlined text-[18px]" data-icon="support_agent">
            support_agent
          </span>
          Soporte WhatsApp
        </Button>
      </div>
    </aside>
  )
}
