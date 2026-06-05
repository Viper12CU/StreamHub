import Link from "next/link"
import { cn } from "@/lib/utils"
import { AdminSearchInput } from "@/components/molecules/admin-search-input"
import { AdminUserProfile } from "@/components/molecules/admin-user-profile"

interface AdminTopBarProps {
  collapsed: boolean
}

export function AdminTopBar({ collapsed }: AdminTopBarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-20 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b border-white/10 dark:border-outline-variant flex justify-between items-center px-8 py-4 shadow-sm z-40 transition-all duration-300",
        collapsed ? "w-[calc(100%-72px)]" : "w-[calc(100%-280px)]",
      )}
    >
      <div className="flex items-center gap-6 flex-1">
        <AdminSearchInput />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 mr-6">
          <button className="p-2 text-on-surface-variant hover:bg-white/5 rounded-full transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-white/5 rounded-full transition-colors cursor-pointer active:scale-95">
            <Link href="/admin/settings">
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-white/5 rounded-full transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        <AdminUserProfile />
      </div>
    </header>
  )
}
