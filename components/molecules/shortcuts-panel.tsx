interface Shortcut {
  icon: string
  label: string
  color: string
  hoverColor: string
  iconBg: string
}

const shortcuts: Shortcut[] = [
  { icon: "add_box", label: "Crear Producto", color: "bg-surface-container-low", hoverColor: "hover:bg-primary-container hover:text-white-container", iconBg: "bg-primary/20" },
  { icon: "inventory_2", label: "Agregar Inventario", color: "bg-surface-container-low", hoverColor: "hover:bg-secondary-container hover:text-on-secondary-container", iconBg: "bg-secondary/20" },
  { icon: "shopping_cart", label: "Crear Pedido", color: "bg-surface-container-low", hoverColor: "hover:bg-tertiary-container hover:text-on-tertiary-container", iconBg: "bg-tertiary/20" },
  { icon: "verified", label: "Verificar Pagos", color: "bg-surface-container-low", hoverColor: "hover:bg-primary-container hover:text-white-container", iconBg: "bg-primary/20" },
  { icon: "group", label: "Gestionar Usuarios", color: "bg-surface-container-low", hoverColor: "hover:bg-secondary-container hover:text-on-secondary-container", iconBg: "bg-secondary/20" },
  { icon: "analytics", label: "Ver Reportes", color: "bg-surface-container-low", hoverColor: "hover:bg-error-container hover:text-on-error-container", iconBg: "bg-error/20" },
]

export function ShortcutsPanel() {
  return (
    <div className="glass p-6 rounded-xl flex flex-col gap-3 md:col-span-3 lg:col-span-4">
      <h3 className="text-2xl font-semibold text-on-surface mb-4">Accesos Rápidos</h3>
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.label}
            className={`flex items-center gap-3 p-3 ${shortcut.color} ${shortcut.hoverColor} rounded-lg transition-all group`}
          >
            <span className={`material-symbols-outlined text-sm p-1 ${shortcut.iconBg} rounded group-hover:bg-white/20`}>
              {shortcut.icon}
            </span>
            <span className="text-xs font-bold">{shortcut.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
