"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { AdminLogo } from "@/components/molecules/admin-logo"
import { AdminNavItem } from "@/components/atoms/admin-nav-item"
import { CollapseButton } from "@/components/atoms/collapse-button"
import { Icon } from "@/components/atoms/icon"
import { signOut } from "@/lib/api/auth"

const navItems = [
  { label: "Dashboard", icon: "view-dashboard", href: "/admin" },
  { label: "Plataformas", icon: "television", href: "/admin/platforms" },
  { label: "Productos", icon: "shape", href: "/admin/products" },
  { label: "Inventario", icon: "package-variant", href: "/admin/inventory" },
  // { label: "Pedidos", icon: "cart", href: "/admin/orders" },
  { label: "Ofertas", icon: "tag", href: "/admin/offers" },
  { label: "Clientes", icon: "account-group", href: "/admin/customers" },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {}
    router.push("/admin/login")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-surface-container dark:bg-surface-container-lowest border-r border-white/5 flex flex-col gap-2 shadow-2xl z-50 transition-all duration-300",
        collapsed ? "w-[72px] p-3" : "w-[280px] p-6",
      )}
    >
      <AdminLogo collapsed={collapsed} />
      <div className="h-10"></div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)
          return (
            <AdminNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              collapsed={collapsed}
            />
          )
        })}
      </nav>


      <div className="mt-auto pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex items-center gap-6 text-on-surface-variant hover:text-error transition-colors rounded-lg w-full",
            collapsed ? "justify-center px-0 py-3" : "px-4 py-3",
            "cursor-pointer",
          )}
        >
          <Icon name="logout" size="2xl" />
          {!collapsed && <span className="text-xs font-semibold">Logout</span>}
        </button>
      </div>

      <CollapseButton collapsed={collapsed} onToggle={onToggle} />
    </aside>
  )
}
