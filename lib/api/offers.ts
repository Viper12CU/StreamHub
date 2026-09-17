import apiClient from "../axios"
import type { AxiosError } from "axios"

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
  filters?: OfferFilters,
  signal?: AbortSignal
): Promise<Offer[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.type) params.set("type", filters.type)
    if (filters?.status) params.set("status", filters.status)

    const qs = params.toString()
    const response = await apiClient.get(`/offers?${qs}`, { signal })
    return response.data.data as Offer[]
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener ofertas"))
  }
}

export async function getOfferById(id: string): Promise<OfferWithProducts> {
  try {
    const response = await apiClient.get(`/offers/admin/${id}`)
    return response.data.data as OfferWithProducts
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener oferta"))
  }
}

export async function createOffer(data: CreateOfferInput): Promise<OfferWithProducts> {
  try {
    const response = await apiClient.post("/offers", data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "crear oferta"))
  }
}

export async function updateOffer(id: string, data: UpdateOfferInput): Promise<Offer> {
  try {
    const response = await apiClient.put(`/offers/admin/${id}`, data)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "actualizar oferta"))
  }
}

export async function deactivateOffer(id: string): Promise<Offer> {
  try {
    const response = await apiClient.put(`/offers/admin/${id}/deactivate`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "desactivar oferta"))
  }
}

export async function activateOffer(id: string): Promise<Offer> {
  try {
    const response = await apiClient.put(`/offers/admin/${id}/activate`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "activar oferta"))
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    await apiClient.delete(`/offers/admin/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar oferta"))
  }
}

export async function addProductToOffer(offerId: string, productId: string): Promise<OfferProduct> {
  try {
    const response = await apiClient.post(`/offers/admin/${offerId}/products/${productId}`)
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "agregar producto a oferta"))
  }
}

export async function removeProductFromOffer(offerId: string, productId: string): Promise<void> {
  try {
    await apiClient.delete(`/offers/admin/${offerId}/products/${productId}`)
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar producto de oferta"))
  }
}
