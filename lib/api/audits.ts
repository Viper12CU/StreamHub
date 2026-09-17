import axios from "@/lib/axios"

// ─── Types ──────────────────────────────────────────────────────────────────

export type AuditCategory =
  | "platform"
  | "product"
  | "inventory"
  | "order"
  | "customer"
  | "credit"
  | "user"
  | "offer"
  | "wishlist"
  | "system"

export type AuditStatus = "info" | "warning" | "error"

export interface Audit {
  id: string
  message: string
  category: AuditCategory
  status: AuditStatus
  user_id: string | null
  entity_type: string | null
  entity_id: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AuditFilters {
  category?: AuditCategory
  status?: AuditStatus
  user_id?: string
  entity_type?: string
  start_date?: string
  end_date?: string
  search?: string
}

// ─── API ────────────────────────────────────────────────────────────────────

export async function getAudits(
  filters: AuditFilters = {},
  page = 1,
  limit = 20,
  signal?: AbortSignal
): Promise<{ data: Audit[]; pagination: PaginationMeta }> {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))
  if (filters.category) params.set("category", filters.category)
  if (filters.status) params.set("status", filters.status)
  if (filters.user_id) params.set("user_id", filters.user_id)
  if (filters.entity_type) params.set("entity_type", filters.entity_type)
  if (filters.start_date) params.set("start_date", filters.start_date)
  if (filters.end_date) params.set("end_date", filters.end_date)
  if (filters.search) params.set("search", filters.search)

  const { data } = await axios.get(`/audits?${params.toString()}`, { signal })
  return { data: data.data, pagination: data.pagination }
}
