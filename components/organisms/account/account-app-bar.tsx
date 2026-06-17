"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/atoms/icon"

export function AccountAppBar() {
  const pathname = usePathname()
  const isSettingsActive = pathname === "/web/account/settings"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--surface-container-lowest)]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:hidden">
      <span className="font-black text-xl text-primary tracking-tight">StreamHub</span>

      <Link
        href="/web/account/settings"
        className={cn(
          "p-2 rounded-full transition-colors",
          isSettingsActive
            ? "text-primary bg-primary/10"
            : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-white/5"
        )}
      >
        <Icon name="cog" className="text-[22px]" />
      </Link>
    </header>
  )
}
