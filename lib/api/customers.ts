import apiClient from "../axios"
import type { AxiosError } from "axios"

// ─── Simple request cache ─────────────────────────────────

const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 30_000

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function clearCustomerCache() {
  cache.clear()
}

// ─── Types ──────────────────────────────────────────────

export type CustomerStatus = "active" | "inactive" | "vip" | "suspended"

export type CustomerSortOption = "recent" | "value" | "orders" | "last_active" | "name"

export interface Customer {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  country: string | null
  image: string | null
  status: CustomerStatus
  notes: string | null
  whatsapp: string | null
  total_orders: number
  lifetime_value: number
  active_subscriptions: number
  last_purchase: string | null
  created_at: string
  updated_at: string
}

export interface CustomerDetail extends Customer {
  recent_orders: {
    id: string
    order_number: string
    product_name: string
    amount_usd: number
    status: string
    created_at: string
  }[]
  subscriptions: {
    product_name: string
    platform_name: string
    platform_color: string
    status: string
    expires_at: string
  }[]
}

export interface CustomerStats {
  total_customers: number
  new_this_month: number
  active: number
  vip: number
  inactive: number
  suspended: number
  pending_orders: number
  churn_risk: number
}

export interface CustomerAnalyticsData {
  growth: { month: string; count: number; total: number }[]
  segments: { segment: string; count: number; percentage: number }[]
  top_customers: { id: string; name: string; email: string; lifetime_value: number; total_orders: number }[]
  retention: { repeat_buyers: number; one_time_buyers: number; retention_rate: number }
}

export interface CustomerInsightItem {
  id: string
  type: "high_value" | "inactive" | "expiring" | "repeat_buyer"
  title: string
  description: string
  value: string
}

export interface CreateCustomerInput {
  user_id: string
  phone?: string
  country?: string
  status?: CustomerStatus
  notes?: string
  whatsapp?: string
}

export interface UpdateCustomerInput {
  phone?: string
  country?: string
  status?: CustomerStatus
  notes?: string
  whatsapp?: string
}

export interface CustomerFilters {
  search?: string
  status?: CustomerStatus
  sort?: CustomerSortOption
  registration_start?: string
  registration_end?: string
  lifetime_value_min?: number
  lifetime_value_max?: number
  total_orders_min?: number
  total_orders_max?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CustomerCounts {
  all: number
  active: number
  inactive: number
  vip: number
  pending: number
  suspended: number
}

// ─── Error handler ──────────────────────────────────────

function getErrorMessage(error: AxiosError, action: string): string {
  const status = error.response?.status
  const data = error.response?.data as { message?: string; error?: string } | undefined

  if (data?.message) return data.message
  if (data?.error) return data.error
  if (!error.response) return `Error de red al ${action}`

  switch (status) {
    case 400: return `Solicitud inválida al ${action}`
    case 401: return `No autorizado al ${action}`
    case 403: return `Acceso denegado al ${action}`
    case 404: return `Recurso no encontrado al ${action}`
    case 409: return `Conflicto al ${action}`
    case 422: return `Datos no procesables al ${action}`
    case 429: return `Demasiadas solicitudes al ${action}`
    case 500: return `Error interno del servidor al ${action}`
    default: return `Error desconocido (${status}) al ${action}`
  }
}

// ─── API Functions ──────────────────────────────────────

export async function getCustomers(
  filters?: CustomerFilters,
  page: number = 1,
  limit: number = 50
): Promise<{ data: Customer[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.status) params.set("status", filters.status)
    if (filters?.sort) params.set("sort", filters.sort)
    if (filters?.registration_start) params.set("registration_start", filters.registration_start)
    if (filters?.registration_end) params.set("registration_end", filters.registration_end)
    if (filters?.lifetime_value_min) params.set("lifetime_value_min", String(filters.lifetime_value_min))
    if (filters?.lifetime_value_max) params.set("lifetime_value_max", String(filters.lifetime_value_max))
    if (filters?.total_orders_min) params.set("total_orders_min", String(filters.total_orders_min))
    if (filters?.total_orders_max) params.set("total_orders_max", String(filters.total_orders_max))
    params.set("page", String(page))
    params.set("limit", String(limit))

    const cacheKey = `customers:list:${params.toString()}`
    const cached = getCached<{ data: Customer[]; pagination: PaginationMeta }>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/customers?${params.toString()}`)
    const result = { data: response.data.data, pagination: response.data.pagination }
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener clientes"))
  }
}

export async function getCustomerStats(): Promise<CustomerCounts> {
  try {
    const cacheKey = "customers:stats"
    const cached = getCached<CustomerCounts>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/customers/stats")
    const raw = response.data.data
    const result: CustomerCounts = {
      all: raw.total_customers ?? 0,
      active: raw.active ?? 0,
      inactive: raw.inactive ?? 0,
      vip: raw.vip ?? 0,
      pending: raw.churn_risk ?? 0,
      suspended: raw.suspended ?? 0,
    }
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener estadísticas de clientes"))
  }
}

export async function getCustomerById(id: string): Promise<CustomerDetail> {
  try {
    const response = await apiClient.get(`/customers/${id}`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener cliente"))
  }
}

export async function getCustomerAnalytics(): Promise<CustomerAnalyticsData> {
  try {
    const cacheKey = "customers:analytics"
    const cached = getCached<CustomerAnalyticsData>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/customers/analytics")
    setCache(cacheKey, response.data.data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener analytics de clientes"))
  }
}

export async function getCustomerInsights(): Promise<CustomerInsightItem[]> {
  try {
    const cacheKey = "customers:insights"
    const cached = getCached<CustomerInsightItem[]>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/customers/insights")
    setCache(cacheKey, response.data.data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener insights de clientes"))
  }
}

export async function createCustomer(data: CreateCustomerInput): Promise<Customer> {
  try {
    const response = await apiClient.post("/customers", data)
    clearCustomerCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "crear cliente"))
  }
}

export async function updateCustomer(id: string, data: UpdateCustomerInput): Promise<Customer> {
  try {
    const response = await apiClient.put(`/customers/${id}`, data)
    clearCustomerCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "actualizar cliente"))
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await apiClient.delete(`/customers/${id}`)
    clearCustomerCache()
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar cliente"))
  }
}

export interface CustomerActivityItem {
  id: string
  action: string
  detail: string
  timestamp: string
  metadata: Record<string, unknown> | null
}

export async function getCustomerActivity(limit: number = 20): Promise<CustomerActivityItem[]> {
  try {
    const cacheKey = `customers:activity:${limit}`
    const cached = getCached<CustomerActivityItem[]>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/customers/activity?limit=${limit}`)
    setCache(cacheKey, response.data.data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener actividad de clientes"))
  }
}
