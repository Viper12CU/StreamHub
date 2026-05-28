"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  label: string
  isActive?: boolean
}

export function SidebarLink({ href, icon: Icon, label, isActive = false }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-r-lg transition-all text-sm",
        isActive
          ? "text-red-200 bg-gradient-to-r from-red-600/20 to-transparent border-l-4 border-red-600"
          : "text-neutral-400 hover:text-red-300"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}
