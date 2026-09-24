import apiClient from "../axios"
import type { AxiosError } from "axios"
import type { CreditTransactionType } from "./credits"
import { getCached, setCache, clearCacheByPrefix, deleteCacheKey } from "./cache"

export function clearAccountCache() {
  clearCacheByPrefix("account:")
}

// ─── Types ──────────────────────────────────────────────

export interface Subscription {
  product_name: string
  platform_name: string
  platform_slug: string
  platform_color: string | null
  status: string
  expires_at: string | null
}

export interface MyProfile {
  id: string
  user_id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  whatsapp: string | null
  total_orders: number
  lifetime_value: number
  active_subscriptions: number
  last_purchase: string | null
  subscriptions: Subscription[]
}

export type OrderStatus = "pending" | "proof_sent" | "confirmed" | "delivered" | "cancelled"
export type PaymentMethod = "transfermovil" | "zelle" | "mlc" | "credits"

export interface MyOrder {
  id: string
  order_number: string
  product_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  amount_usd: number
  amount_mlc: number
  amount_credits: number
  credit_transaction_id: string | null
  credentials: string | null
  product_title: string
  platform_name: string
  created_at: string
  updated_at: string
}

export interface UpdateMyProfileInput {
  name?: string
  phone?: string | null
  whatsapp?: string | null
}

// ─── Error handler ──────────────────────────────────────

function getErrorMessage(error: AxiosError, action: string): string {
  const status = error.response?.status
  const data = error.response?.data as { message?: string; error?: string } | undefined

  if (data?.message) return data.message
  if (data?.error) return data.error
  if (!error.response) return `Error de red al ${action}`

  switch (status) {
    case 400: return `Solicitud invalida al ${action}`
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

export async function getMyProfile(): Promise<MyProfile> {
  try {
    const cacheKey = "account:profile"
    const cached = getCached<MyProfile>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/customers/me")
    const result = response.data.data
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener perfil"))
  }
}

export async function updateMyProfile(data: UpdateMyProfileInput): Promise<MyProfile> {
  try {
    const response = await apiClient.put("/customers/me", data)
    deleteCacheKey("account:profile")
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "actualizar perfil"))
  }
}

export async function getMyOrders(): Promise<MyOrder[]> {
  try {
    const cacheKey = "account:orders"
    const cached = getCached<MyOrder[]>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/orders/my")
    const result = response.data.data
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener ordenes"))
  }
}

// ─── Credits (Customer-facing) ─────────────────────────────

export interface MyCreditBalance {
  id: string
  customer_id: string
  balance: number
  lifetime_credited: number
  lifetime_spent: number
  created_at: string
  updated_at: string
}

export interface MyCreditTransaction {
  id: string
  customer_id: string
  type: CreditTransactionType
  amount: number
  balance_before: number
  balance_after: number
  reason: string | null
  created_at: string
}

export interface CreditPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export async function getMyCreditBalance(): Promise<MyCreditBalance> {
  try {
    const cacheKey = "account:credits:balance"
    const cached = getCached<MyCreditBalance>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/credits/me")
    const result = response.data.data
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener balance de créditos"))
  }
}

export async function getMyCreditTransactions(
  page: number = 1,
  limit: number = 20
): Promise<{ data: MyCreditTransaction[]; pagination: CreditPaginationMeta }> {
  try {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))

    const cacheKey = `account:credits:transactions:${params.toString()}`
    const cached = getCached<{ data: MyCreditTransaction[]; pagination: CreditPaginationMeta }>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/credits/me/transactions?${params.toString()}`)
    const result = { data: response.data.data, pagination: response.data.pagination }
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener transacciones de crédito"))
  }
}

// ─── Purchase with credits ──────────────────────────────────

export interface PurchaseOrderSummary {
  id: string
  order_number: string
  amount_credits: number
}

export interface PurchaseWithCreditsResult {
  order: PurchaseOrderSummary
}

const PURCHASE_ERROR_MESSAGES: Record<number, string> = {
  400: "El producto no esta disponible para compra.",
  401: "Tu sesion ha expirado. Inicia sesion de nuevo.",
  402: "Creditos insuficientes para completar la compra.",
  404: "Producto no encontrado.",
  409: "No hay inventario disponible para este producto.",
}

export async function purchaseWithCredits(productId: string): Promise<PurchaseWithCreditsResult> {
  try {
    const response = await apiClient.post("/credits/purchase", { product_id: productId })
    const result: PurchaseWithCreditsResult = response.data.data

    deleteCacheKey("account:credits:balance")
    clearCacheByPrefix("account:credits:transactions")
    deleteCacheKey("account:orders")

    return result
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>
    const status = axiosError.response?.status

    if (status && PURCHASE_ERROR_MESSAGES[status]) {
      const serverMsg = axiosError.response?.data?.error
      if (status === 400 && serverMsg && serverMsg !== "Product is not available" && serverMsg !== "Product credit price must be greater than zero") {
        throw new Error(serverMsg)
      }
      throw new Error(PURCHASE_ERROR_MESSAGES[status])
    }

    throw new Error(getErrorMessage(axiosError, "completar la compra"))
  }
}
