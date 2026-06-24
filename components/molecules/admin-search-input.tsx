import { Icon } from "@/components/atoms/icon"

interface AdminSearchInputProps {
  placeholder?: string
}

export function AdminSearchInput({ placeholder = "Buscar pedido o cliente..." }: AdminSearchInputProps) {
  return (
    <div className="relative w-full max-w-md" role="search">
      <Icon name="magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
      <input
        aria-label="Buscar pedido o cliente"
        className="w-full bg-surface-container border-none rounded-full pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/50 transition-all"
        placeholder={placeholder}
        type="search"
      />
    </div>
  )
}
