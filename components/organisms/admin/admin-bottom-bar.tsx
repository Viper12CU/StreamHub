"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

const navItems = [
  { label: "Dashboard", icon: "view-dashboard", href: "/admin" },
  { label: "Plataformas", icon: "television", href: "/admin/platforms" },
  { label: "Productos", icon: "shape", href: "/admin/products" },
  { label: "Inventario", icon: "package-variant", href: "/admin/inventory" },
  { label: "Pedidos", icon: "cart", href: "/admin/orders" },
  { label: "Clientes", icon: "account-group", href: "/admin/customers" },
]

export function AdminBottomBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
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
