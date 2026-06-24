import type { ProductStatus, ProductType } from "@/lib/api/products"

export {
  productStatusMap as statusMap,
  productTypeMap,
  generateSlug,
  formatDate,
  formatRelativeDate,
  formatDateFull,
  getInventoryColor,
} from "@/lib/constants/shared"

export const productTypes: { label: string; value: ProductType }[] = [
  { label: "Cuenta Completa", value: "full_account" },
  { label: "Perfil Compartido", value: "shared_profile" },
  { label: "Código de Activación", value: "activation_code" },
  { label: "Paquete de Suscripción", value: "subscription_package" },
]

export const statusOptions: { label: string; value: ProductStatus; color: string; desc: string }[] = [
  { value: "active", label: "Activo", desc: "Visible y disponible para venta", color: "text-green-400" },
  { value: "draft", label: "Borrador", desc: "Oculto, en edición", color: "text-on-surface-variant" },
  { value: "archived", label: "Archivado", desc: "No visible, conserva datos", color: "text-on-surface-variant" },
  { value: "out_of_stock", label: "Sin Stock", desc: "Sin inventario disponible", color: "text-error" },
]

export function safeToFixed(value: string | number | null | undefined, decimals = 2): string {
  const num = Number(value)
  if (isNaN(num)) return "0.00"
  return num.toFixed(decimals)
}
