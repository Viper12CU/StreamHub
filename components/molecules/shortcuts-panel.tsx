import Link from "next/link"
import { Icon } from "@/components/atoms/icon"

interface Shortcut {
  icon: string
  label: string
  description: string
  href: string
  borderClass: string
}

interface ShortcutGroup {
  title: string
  icon: string
  items: Shortcut[]
}

const groups: ShortcutGroup[] = [
  {
    title: "Crear",
    icon: "plus-circle",
    items: [
      { icon: "shape", label: "Producto", description: "Nuevo en el catálogo", href: "/admin/products", borderClass: "border-l-primary" },
      { icon: "package-variant", label: "Inventario", description: "Agregar stock digital", href: "/admin/inventory", borderClass: "border-l-secondary" },
      { icon: "television", label: "Plataforma", description: "Netflix, Spotify, etc.", href: "/admin/platforms", borderClass: "border-l-tertiary" },
      { icon: "account-group", label: "Cliente", description: "Registrar nuevo cliente", href: "/admin/customers", borderClass: "border-l-green-500" },
    ],
  },
  {
    title: "Gestionar",
    icon: "cog",
    items: [
      { icon: "tag", label: "Ofertas", description: "Descuentos y combos", href: "/admin/offers", borderClass: "border-l-purple-400" },
      { icon: "cash", label: "Créditos", description: "Cuentas de crédito", href: "/admin/credits", borderClass: "border-l-amber-500" },
      { icon: "text-box-check", label: "Auditoría", description: "Registro de actividad", href: "/admin/audit", borderClass: "border-l-error" },
    ],
  },
]

export function ShortcutsPanel() {
  return (
    <div className="glass p-6 rounded-xl flex flex-col gap-5 md:col-span-3 lg:col-span-4">
      <div className="flex items-center gap-2">
        <Icon name="lightning-bolt" size="xl" className="text-primary" />
        <h3 className="text-xl font-bold text-on-surface">Accesos Rápidos</h3>
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name={group.icon} size="xs" className="text-on-surface-variant/60" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                {group.title}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-2.5 p-2.5 rounded-lg
                    bg-surface-container-low border-l-2 ${item.borderClass}
                    hover:bg-surface-container-high/80
                    transition-all duration-200 ease-out
                    hover:-translate-y-0.5 hover:shadow-lg
                  `}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-surface-container-high flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon name={item.icon} size="sm" className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface truncate leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/50 truncate leading-tight">
                      {item.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
