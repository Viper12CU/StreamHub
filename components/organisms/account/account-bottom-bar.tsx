"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

const navItems = [
  { href: "/web/account", label: "Inicio", icon: "view-dashboard" },
  { href: "/web/account/purchases", label: "Compras", icon: "shopping" },
  { href: "/web/account/active-services", label: "Servicios", icon: "credit-card-outline" },
  { href: "/web/account/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/web/catalog", label: "Tienda", icon: "store" },
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
              <Icon
                name={item.icon}
                className={cn(
                  "text-[22px] leading-none transition-all duration-200",
                  isActive && "scale-110"
                )}
              />
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
