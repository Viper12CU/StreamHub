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

export function clearAccountCache() {
  cache.clear()
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
export type PaymentMethod = "transfermovil" | "zelle" | "mlc"

export interface MyOrder {
  id: string
  order_number: string
  product_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  amount_usd: number
  amount_mlc: number
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
    cache.delete("account:profile")
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
