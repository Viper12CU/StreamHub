import type { ProductStatus, ProductType } from "@/lib/api/products"

export const statusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  draft: { label: "Borrador", variant: "neutral" },
  archived: { label: "Archivado", variant: "neutral" },
  out_of_stock: { label: "Sin Stock", variant: "error" },
}

export const productTypeMap: Record<string, string> = {
  full_account: "Cuenta Completa",
  shared_profile: "Perfil Compartido",
  activation_code: "Código de Activación",
  subscription_package: "Paquete de Suscripción",
}

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

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "N/A"
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return "Hace minutos"
  if (diffH < 24) return `Hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `Hace ${diffD}d`
  return d.toLocaleDateString("es-ES", { month: "short", day: "numeric" })
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "N/A"
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return "Hace minutos"
  if (diffH < 24) return `Hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `Hace ${diffD}d`
  return d.toLocaleDateString("es-ES", { month: "short", day: "numeric" })
}

export function formatDateFull(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "N/A"
  return d.toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" })
}

export function getInventoryColor(count: number): string {
  if (count > 20) return "text-green-400"
  if (count >= 5) return "text-amber-500"
  return "text-error"
}

export function safeToFixed(value: string | number | null | undefined, decimals = 2): string {
  const num = Number(value)
  if (isNaN(num)) return "0.00"
  return num.toFixed(decimals)
}
