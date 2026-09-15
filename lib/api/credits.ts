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

export function clearCreditsCache() {
  cache.clear()
}

// ─── Types ──────────────────────────────────────────────

export type CreditTransactionType = "admin_grant" | "admin_deduct" | "adjustment" | "purchase" | "refund"

export type CreditSortOption = "recent" | "balance_high" | "balance_low" | "spent" | "name"

export interface CreditAccount {
  id: string
  customer_id: string
  balance: number
  lifetime_credited: number
  lifetime_spent: number
  created_at: string
  updated_at: string
}

export interface CreditAccountWithUser extends CreditAccount {
  user_name: string | null
  user_email: string | null
}

export interface CreditTransaction {
  id: string
  customer_id: string
  admin_user_id: string | null
  order_id: string | null
  type: CreditTransactionType
  amount: number
  balance_before: number
  balance_after: number
  reason: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface CreditTransactionWithUser extends CreditTransaction {
  user_name: string
  user_email: string
  admin_name: string | null
  order_number: string | null
}

export interface CreditStats {
  total_balance: number
  total_credited: number
  total_spent: number
  total_accounts: number
  active_accounts: number
}

export interface CreditAnalyticsData {
  transactions_by_type: { type: CreditTransactionType; count: number; total_amount: number }[]
  balance_distribution: { range: string; count: number }[]
  top_users: { user_id: string; user_name: string; balance: number }[]
  daily_activity: { date: string; grants: number; deductions: number; purchases: number }[]
}

export interface CreditAccountFilters {
  search?: string
  sort?: CreditSortOption
  has_balance?: boolean
  balance_min?: number
  balance_max?: number
}

export interface CreditTransactionFilters {
  type?: CreditTransactionType
  customer_id?: string
  order_id?: string
}

export interface GrantCreditsInput {
  amount: number
  reason?: string
}

export interface DeductCreditsInput {
  amount: number
  reason?: string
}

export interface AdjustCreditsInput {
  balance: number
  reason?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CreditCounts {
  all: number
  with_balance: number
  no_balance: number
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

export async function getCreditAccounts(
  filters?: CreditAccountFilters,
  page: number = 1,
  limit: number = 50
): Promise<{ data: CreditAccountWithUser[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.sort) params.set("sort", filters.sort)
    if (filters?.has_balance !== undefined) params.set("has_balance", String(filters.has_balance))
    if (filters?.balance_min !== undefined) params.set("balance_min", String(filters.balance_min))
    if (filters?.balance_max !== undefined) params.set("balance_max", String(filters.balance_max))
    params.set("page", String(page))
    params.set("limit", String(limit))

    const cacheKey = `credits:accounts:${params.toString()}`
    const cached = getCached<{ data: CreditAccountWithUser[]; pagination: PaginationMeta }>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/credits/accounts?${params.toString()}`)
    const result = { data: response.data.data, pagination: response.data.pagination }
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener cuentas de crédito"))
  }
}

export async function getCreditAccountById(customerId: string): Promise<CreditAccountWithUser> {
  try {
    const response = await apiClient.get(`/credits/accounts/${customerId}`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener cuenta de crédito"))
  }
}

export async function getCreditStats(): Promise<CreditStats> {
  try {
    const cacheKey = "credits:stats"
    const cached = getCached<CreditStats>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/credits/stats")
    setCache(cacheKey, response.data.data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener estadísticas de créditos"))
  }
}

export async function getCreditAnalytics(): Promise<CreditAnalyticsData> {
  try {
    const cacheKey = "credits:analytics"
    const cached = getCached<CreditAnalyticsData>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/credits/analytics")
    setCache(cacheKey, response.data.data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener analytics de créditos"))
  }
}

export async function getCreditTransactions(
  filters?: CreditTransactionFilters,
  page: number = 1,
  limit: number = 20
): Promise<{ data: CreditTransactionWithUser[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams()
    if (filters?.type) params.set("type", filters.type)
    if (filters?.customer_id) params.set("customer_id", filters.customer_id)
    if (filters?.order_id) params.set("order_id", filters.order_id)
    params.set("page", String(page))
    params.set("limit", String(limit))

    const cacheKey = `credits:transactions:${params.toString()}`
    const cached = getCached<{ data: CreditTransactionWithUser[]; pagination: PaginationMeta }>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/credits/transactions?${params.toString()}`)
    const result = { data: response.data.data, pagination: response.data.pagination }
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener transacciones de crédito"))
  }
}

export async function getCreditTransactionsByUser(
  customerId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ data: CreditTransactionWithUser[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))

    const response = await apiClient.get(`/credits/accounts/${customerId}/transactions?${params.toString()}`)
    return { data: response.data.data, pagination: response.data.pagination }
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener transacciones del usuario"))
  }
}

export async function grantCredits(customerId: string, data: GrantCreditsInput): Promise<CreditTransaction> {
  try {
    const response = await apiClient.post(`/credits/accounts/${customerId}/grant`, data)
    clearCreditsCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "otorgar créditos"))
  }
}

export async function deductCredits(customerId: string, data: DeductCreditsInput): Promise<CreditTransaction> {
  try {
    const response = await apiClient.post(`/credits/accounts/${customerId}/deduct`, data)
    clearCreditsCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "deducir créditos"))
  }
}

export async function adjustCredits(customerId: string, data: AdjustCreditsInput): Promise<CreditTransaction> {
  try {
    const response = await apiClient.post(`/credits/accounts/${customerId}/adjust`, data)
    clearCreditsCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "ajustar créditos"))
  }
}
