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

export function clearOfferCache() {
  cache.clear()
}

// ─── Types ──────────────────────────────────────────────

export type OfferType = "discount" | "combo"
export type OfferStatus = "active" | "inactive" | "expired"

export interface Offer {
  id: string
  title: string
  description: string | null
  type: OfferType
  status: OfferStatus
  discount_percent: number | null
  discount_amount_usd: number | null
  combo_price_usd: number | null
  combo_price_cup: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface OfferProduct {
  offer_id: string
  product_id: string
  product_name: string
  product_price_sale: number
  platform_name: string
}

export interface OfferWithProducts extends Offer {
  products: OfferProduct[]
}

export interface CreateOfferInput {
  title: string
  description?: string
  type: OfferType
  discount_percent?: number
  discount_amount_usd?: number
  combo_price_usd?: number
  combo_price_cup?: number
  start_date?: string
  end_date?: string
  product_ids?: string[]
}

export interface UpdateOfferInput {
  title?: string
  description?: string
  discount_percent?: number
  discount_amount_usd?: number
  combo_price_usd?: number
  combo_price_cup?: number
  start_date?: string
  end_date?: string
}

export interface OfferFilters {
  search?: string
  type?: OfferType
  status?: OfferStatus
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

export async function getOffers(
  filters?: OfferFilters
): Promise<Offer[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.type) params.set("type", filters.type)
    if (filters?.status) params.set("status", filters.status)

    const qs = params.toString()
    const cacheKey = `offers:list:${qs}`
    const cached = getCached<Offer[]>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/offers?${qs}`)
    const result = response.data.data as Offer[]
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener ofertas"))
  }
}

export async function getOfferById(id: string): Promise<OfferWithProducts> {
  try {
    const cacheKey = `offers:item:${id}`
    const cached = getCached<OfferWithProducts>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/offers/admin/${id}`)
    const result = response.data.data as OfferWithProducts
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener oferta"))
  }
}

export async function createOffer(data: CreateOfferInput): Promise<OfferWithProducts> {
  try {
    const response = await apiClient.post("/offers", data)
    clearOfferCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "crear oferta"))
  }
}

export async function updateOffer(id: string, data: UpdateOfferInput): Promise<Offer> {
  try {
    const response = await apiClient.put(`/offers/admin/${id}`, data)
    clearOfferCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "actualizar oferta"))
  }
}

export async function deactivateOffer(id: string): Promise<Offer> {
  try {
    const response = await apiClient.put(`/offers/admin/${id}/deactivate`)
    clearOfferCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "desactivar oferta"))
  }
}

export async function activateOffer(id: string): Promise<Offer> {
  try {
    const response = await apiClient.put(`/offers/admin/${id}/activate`)
    clearOfferCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "activar oferta"))
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    await apiClient.delete(`/offers/admin/${id}`)
    clearOfferCache()
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar oferta"))
  }
}

export async function addProductToOffer(offerId: string, productId: string): Promise<OfferProduct> {
  try {
    const response = await apiClient.post(`/offers/admin/${offerId}/products/${productId}`)
    clearOfferCache()
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "agregar producto a oferta"))
  }
}

export async function removeProductFromOffer(offerId: string, productId: string): Promise<void> {
  try {
    await apiClient.delete(`/offers/admin/${offerId}/products/${productId}`)
    clearOfferCache()
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar producto de oferta"))
  }
}
