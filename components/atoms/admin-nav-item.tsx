import { memo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

interface AdminNavItemProps {
  href: string
  icon: string
  label: string
  isActive?: boolean
  collapsed?: boolean
}

export const AdminNavItem = memo(function AdminNavItem({ href, icon, label, isActive = false, collapsed = false }: AdminNavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-6 rounded-lg transition-all duration-300",
        collapsed ? "justify-center px-0 py-3" : "px-4 py-3",
        isActive
          ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(229,9,20,0.3)]"
          : "text-on-surface-variant hover:text-on-surface hover:bg-white/5 hover:translate-x-1",
      )}
    >
      <Icon name={icon} className="shrink-0 " size="2xl"/>
      {!collapsed && <span className="text-xs font-semibold">{label}</span>}
    </Link>
  )
})
