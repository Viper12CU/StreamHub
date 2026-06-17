import { Icon } from "@/components/atoms/icon"

interface CollapseButtonProps {
  collapsed: boolean
  onToggle: () => void
}

export function CollapseButton({ collapsed, onToggle }: CollapseButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-12 rounded-r-lg bg-surface-container-high border border-white/10 border-l-0 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-300 z-50 right-[-24px]"
    >
      <Icon name={collapsed ? "chevron-right" : "chevron-left"} className="text-sm transition-transform duration-300" />
    </button>
  )
}
