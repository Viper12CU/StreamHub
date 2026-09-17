import apiClient from "../axios"
import type { AxiosError } from "axios"
import { getCached, setCache, clearCacheByPrefix, deleteCacheKey } from "./cache"

export function clearWishlistCache() {
  clearCacheByPrefix("wishlist:")
}

// ─── Types ──────────────────────────────────────────────

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product_name: string
  product_slug: string
  product_price_sale: number
  product_thumbnail: string | null
  product_image_url: string | null
  platform_name: string
  platform_slug: string
  platform_color: string | null
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
    case 409: return `El producto ya esta en tu wishlist`
    case 422: return `Datos no procesables al ${action}`
    case 429: return `Demasiadas solicitudes al ${action}`
    case 500: return `Error interno del servidor al ${action}`
    default: return `Error desconocido (${status}) al ${action}`
  }
}

// ─── API Functions ──────────────────────────────────────

export async function getMyWishlist(): Promise<WishlistItem[]> {
  try {
    const cacheKey = "wishlist:my"
    const cached = getCached<WishlistItem[]>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get("/wishlists/my")
    const result = response.data.data
    setCache(cacheKey, result)
    return result
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener wishlist"))
  }
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  try {
    const response = await apiClient.post("/wishlists", { product_id: productId })
    deleteCacheKey("wishlist:my")
    return response.data.data
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "agregar a wishlist"))
  }
}

export async function removeFromWishlist(productId: string): Promise<void> {
  try {
    await apiClient.delete(`/wishlists/${productId}`)
    deleteCacheKey("wishlist:my")
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar de wishlist"))
  }
}
