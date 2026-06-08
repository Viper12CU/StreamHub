import apiClient from "../axios";
import type { AxiosError } from "axios";

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

export function clearPlatformCache() {
  cache.clear()
}

// ─── Types ──────────────────────────────────────────────

export type PlatformCategory =
  | "streaming"
  | "musica"
  | "video"
  | "iptv"
  | "software"
  | "vpn"
  | "ai_tools"
  | "gaming"
  | "otro";

export type PlatformStatus = "active" | "inactive" | "archived";

export interface Platform {
  id: string;
  name: string;
  slug: string;
  category: PlatformCategory;
  description: string | null;
  color: string;
  logo_url: string | null;
  banner_url: string | null;
  status: PlatformStatus;
  is_featured: boolean;
  show_in_store: boolean;
  allow_purchases: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformWithMetrics extends Platform {
  products_count: number;
  products_active: number;
  products_draft: number;
  inventory_available: number;
  inventory_assigned: number;
  inventory_expired: number;
  revenue_monthly: number;
  revenue_total: number;
  total_orders: number;
  best_selling_product: string | null;
  conversion_rate: number;
  customer_count: number;
}

export interface PlatformAnalytics {
  products_count: number;
  products_active: number;
  products_draft: number;
  total_orders: number;
  revenue_total: number;
  revenue_monthly: number;
  customer_count: number;
  best_selling_product: string | null;
}

export interface HealthAlert {
  id: string;
  name: string;
  slug: string;
  status: string;
  products_count: number;
  revenue_monthly: number;
  alert: string;
}

export interface PlatformProduct {
  id: string;
  title: string;
  description: string | null;
  type: string;
  duration_days: number;
  price_usd: number;
  price_mlc: number;
  stock_status: string;
  features: string | null;
  active: boolean;
  created_at: string;
}

export interface CreatePlatformInput {
  name: string;
  slug: string;
  category: PlatformCategory;
  description?: string;
  color: string;
  logo_url?: string;
  banner_url?: string;
  status?: PlatformStatus;
  is_featured?: boolean;
  show_in_store?: boolean;
  allow_purchases?: boolean;
}

export interface UpdatePlatformInput {
  name?: string;
  slug?: string;
  category?: PlatformCategory;
  description?: string;
  color?: string;
  logo_url?: string;
  banner_url?: string;
  status?: PlatformStatus;
  is_featured?: boolean;
  show_in_store?: boolean;
  allow_purchases?: boolean;
}

export interface PlatformFilters {
  search?: string;
  status?: PlatformStatus;
  category?: PlatformCategory;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Error handler ──────────────────────────────────────

function getErrorMessage(error: AxiosError, action: string): string {
  const status = error.response?.status;
  const data = error.response?.data as { message?: string } | undefined;

  if (data?.message) return data.message;
  if (!error.response) return `Error de red al ${action}`;

  switch (status) {
    case 400: return `Solicitud inválida al ${action}`;
    case 401: return `No autorizado al ${action}`;
    case 403: return `Acceso denegado al ${action}`;
    case 404: return `Recurso no encontrado al ${action}`;
    case 409: return `Conflicto al ${action}`;
    case 422: return `Datos no procesables al ${action}`;
    case 429: return `Demasiadas solicitudes al ${action}`;
    case 500: return `Error interno del servidor al ${action}`;
    default: return `Error desconocido (${status}) al ${action}`;
  }
}

// ─── API Functions ──────────────────────────────────────

export async function getPlatforms(
  filters?: PlatformFilters,
  page: number = 1,
  limit: number = 50
): Promise<{ data: PlatformWithMetrics[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.category) params.set("category", filters.category);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const cacheKey = `platforms:${params.toString()}`
    const cached = getCached<{ data: PlatformWithMetrics[]; pagination: PaginationMeta }>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/platforms/all?${params.toString()}`);
    setCache(cacheKey, response.data)
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener plataformas"));
  }
}

export async function getActivePlatforms(): Promise<Platform[]> {
  try {
    const response = await apiClient.get("/platforms");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener plataformas activas"));
  }
}

export async function getPlatformById(id: string): Promise<PlatformWithMetrics> {
  try {
    const response = await apiClient.get(`/platforms/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener plataforma"));
  }
}

export async function getPlatformProducts(id: string): Promise<PlatformProduct[]> {
  try {
    const response = await apiClient.get(`/platforms/${id}/products`);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener productos de plataforma"));
  }
}

export async function getPlatformAnalytics(id: string): Promise<PlatformAnalytics> {
  try {
    const response = await apiClient.get(`/platforms/${id}/analytics`);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener analytics de plataforma"));
  }
}

export async function getHealthAlerts(): Promise<HealthAlert[]> {
  try {
    const response = await apiClient.get("/platforms/health");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener alertas de salud"));
  }
}

export async function createPlatform(data: CreatePlatformInput): Promise<Platform> {
  try {
    const response = await apiClient.post("/platforms", data);
    clearPlatformCache()
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "crear plataforma"));
  }
}

export async function updatePlatform(id: string, data: UpdatePlatformInput): Promise<Platform> {
  try {
    const response = await apiClient.put(`/platforms/${id}`, data);
    clearPlatformCache()
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "actualizar plataforma"));
  }
}

export async function deletePlatform(id: string): Promise<void> {
  try {
    await apiClient.delete(`/platforms/${id}`);
    clearPlatformCache()
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar plataforma"));
  }
}
