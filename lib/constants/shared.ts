import type { PlatformCategory } from "@/lib/api/platforms"

// ─── Status Maps (by domain) ────────────────────────────────────────────────

export const productStatusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  draft: { label: "Borrador", variant: "neutral" },
  archived: { label: "Archivado", variant: "neutral" },
  out_of_stock: { label: "Sin Stock", variant: "error" },
}

export const platformStatusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activa", variant: "success" },
  inactive: { label: "Inactiva", variant: "warning" },
  archived: { label: "Archivada", variant: "neutral" },
}

export const customerStatusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  vip: { label: "VIP", variant: "warning" },
  inactive: { label: "Inactivo", variant: "neutral" },
  suspended: { label: "Suspendido", variant: "error" },
}

export const orderStatusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  pending: { label: "Pendiente", variant: "warning" },
  payment_submitted: { label: "Pago Enviado", variant: "neutral" },
  payment_review: { label: "Revisión de Pago", variant: "warning" },
  approved: { label: "Aprobada", variant: "success" },
  inventory_assigned: { label: "Inventario Asignado", variant: "success" },
  delivered: { label: "Entregada", variant: "success" },
  cancelled: { label: "Cancelada", variant: "error" },
  refunded: { label: "Reembolsada", variant: "error" },
}

export const offerStatusMap: Record<string, { label: string; variant: "success" | "error" | "warning" | "neutral" }> = {
  active: { label: "Activa", variant: "success" },
  inactive: { label: "Inactiva", variant: "warning" },
  expired: { label: "Expirada", variant: "error" },
}

export const inventoryStatusMap: Record<string, { label: string; variant: "success" | "warning" | "neutral" | "error" }> = {
  available: { label: "Disponible", variant: "success" },
  reserved: { label: "Reservado", variant: "warning" },
  assigned: { label: "Asignado", variant: "neutral" },
  expired: { label: "Expirado", variant: "error" },
  suspended: { label: "Suspendido", variant: "error" },
}

// ─── Type Labels ─────────────────────────────────────────────────────────────

export const productTypeMap: Record<string, string> = {
  full_account: "Cuenta Completa",
  shared_profile: "Perfil Compartido",
  activation_code: "Código de Activación",
  subscription_package: "Paquete de Suscripción",
}

export const assetTypeLabels: Record<string, string> = {
  account: "Cuenta Completa",
  profile: "Perfil Compartido",
  code: "Código de Activación",
  package: "Paquete de Suscripción",
}

// ─── Platform Categories ─────────────────────────────────────────────────────

export const platformCategories: { value: PlatformCategory; label: string }[] = [
  { value: "streaming", label: "Streaming" },
  { value: "musica", label: "Música" },
  { value: "video", label: "Video" },
  { value: "iptv", label: "IPTV" },
  { value: "software", label: "Software" },
  { value: "vpn", label: "VPN" },
  { value: "ai_tools", label: "AI Tools" },
  { value: "gaming", label: "Gaming" },
  { value: "otro", label: "Otro" },
]

// ─── Platform Colors ─────────────────────────────────────────────────────────

export const platformColors: Record<string, string> = {
  Netflix: "bg-primary-container",
  Spotify: "bg-secondary",
  "YouTube Premium": "bg-[#ff0000]",
  "HBO Max": "bg-[#b829e3]",
  "Disney+": "bg-tertiary",
  Crunchyroll: "bg-[#f47521]",
  IPTV: "bg-amber-500",
}

// ─── Utility Functions ───────────────────────────────────────────────────────

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
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
  } catch {
    return "N/A"
  }
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

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function getRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "Nunca"
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Hoy"
  if (days === 1) return "Ayer"
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem`
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`
  return `Hace ${Math.floor(days / 365)} años`
}

export function getMonthYear(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
}

export function getLetter(name: string): string {
  return name.charAt(0).toUpperCase()
}

export function getInventoryColor(count: number): string {
  if (count > 20) return "text-green-400"
  if (count >= 5) return "text-amber-500"
  return "text-error"
}
