import { cn } from "@/lib/utils"

interface AdminLogoProps {
  collapsed?: boolean
}

export function AdminLogo({ collapsed = false }: AdminLogoProps) {
  return (
    <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-4 px-2")}>
      <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center glow-red shrink-0">
        <span
          className="material-symbols-outlined text-white-container"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          cloud_sync
        </span>
      </div>
      {!collapsed && (
        <div>
          <h1 className="text-2xl font-semibold text-primary leading-tight">StreamHub</h1>
          <p className="text-xs font-semibold text-on-surface-variant opacity-70">Admin Portal</p>
        </div>
      )}
    </div>
  )
}
