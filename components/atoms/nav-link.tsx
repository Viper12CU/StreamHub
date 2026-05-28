"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  className?: string
}

export function NavLink({ href, children, isActive = false, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-medium transition-colors duration-300",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  )
}
