"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/web/account", label: "Inicio", icon: "dashboard" },
  { href: "/web/account/purchases", label: "Compras", icon: "shopping_bag" },
  { href: "/web/account/active-services", label: "Servicios", icon: "subscriptions" },
  { href: "/web/account/wishlist", label: "Wishlist", icon: "favorite" },
  { href: "/web/catalog", label: "Tienda", icon: "storefront" },
]

export function AccountBottomBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-container-lowest)]/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 relative",
                isActive
                  ? "text-primary"
                  : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px] leading-none transition-all duration-200",
                  isActive && "scale-110"
                )}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-tight truncate">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-0.5 rounded-full bg-primary glow-red" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
