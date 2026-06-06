import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdminNavItemProps {
  href: string
  icon: string
  label: string
  isActive?: boolean
  collapsed?: boolean
}

export function AdminNavItem({ href, icon, label, isActive = false, collapsed = false }: AdminNavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-6 rounded-lg transition-all duration-300",
        collapsed ? "justify-center px-0 py-3" : "px-4 py-3",
        isActive
          ? "bg-primary-container text-white-container shadow-[0_0_15px_rgba(229,9,20,0.3)]"
          : "text-on-surface-variant hover:text-on-surface hover:bg-white/5 hover:translate-x-1",
      )}
    >
      <span
        className="material-symbols-outlined shrink-0"
        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      {!collapsed && <span className="text-xs font-semibold">{label}</span>}
    </Link>
  )
}
