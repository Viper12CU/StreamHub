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

export function clearProductCache() {
  cache.clear()
}

// ─── Types ──────────────────────────────────────────────

export type ProductType =
  | "full_account"
  | "shared_profile"
  | "activation_code"
  | "subscription_package";

export type ProductStatus = "active" | "draft" | "archived" | "out_of_stock";

export type InventoryStatus = "available" | "assigned" | "sold" | "expired";

export interface Product {
  id: string;
  platform_id: string;
  name: string;
  slug: string;
  description: string | null;
  product_type: ProductType;
  price_sale: number;
  price_cost: number | null;
  currency: string;
  thumbnail: string | null;
  stock_initial: number;
  low_stock_threshold: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductWithDetails extends Product {
  platform_name: string;
  platform_slug: string;
  platform_color: string;
  available_units: number;
  reserved_units: number;
  sold_units: number;
  margin: number | null;
  total_revenue: number;
  total_orders: number;
}

export interface ProductMetrics {
  available_units: number;
  reserved_units: number;
  sold_units: number;
  total_revenue: number;
  total_orders: number;
  conversion_rate: number;
  margin: number | null;
}

export interface ProductAnalytics {
  top_products: Array<{
    name: string;
    platform_name: string;
    platform_color: string;
    orders: number;
    revenue: number;
  }> | null;
  sales_by_platform: Array<{
    platform_name: string;
    platform_color: string;
    count: number;
    revenue: number;
  }> | null;
  growth_trends: Array<{
    month: string;
    orders: number;
    revenue: number;
  }> | null;
}

export interface ProductHealth {
  low_stock_products: Array<{
    id: string;
    name: string;
    available_units: number;
    low_stock_threshold: number;
  }> | null;
  out_of_stock_products: Array<{ id: string; name: string }> | null;
  most_stocked_products: Array<{
    id: string;
    name: string;
    available_units: number;
  }> | null;
}

export interface CreateProductInput {
  platform_id: string;
  name: string;
  slug?: string;
  description?: string;
  product_type: ProductType;
  price_sale: number;
  price_cost?: number;
  currency?: string;
  thumbnail?: string;
  stock_initial?: number;
  low_stock_threshold?: number;
  status?: ProductStatus;
}

export interface UpdateProductInput {
  platform_id?: string;
  name?: string;
  slug?: string;
  description?: string;
  product_type?: ProductType;
  price_sale?: number;
  price_cost?: number;
  currency?: string;
  thumbnail?: string;
  stock_initial?: number;
  low_stock_threshold?: number;
  status?: ProductStatus;
}

export interface ProductFilters {
  search?: string;
  platform_id?: string;
  product_type?: ProductType;
  status?: ProductStatus;
  inventory_status?: InventoryStatus;
  price_min?: number;
  price_max?: number;
  sort?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BulkAction {
  action: "activate" | "deactivate" | "archive" | "delete";
  ids: string[];
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

export async function getProducts(
  filters?: ProductFilters,
  page: number = 1,
  limit: number = 10
): Promise<{ data: ProductWithDetails[]; pagination: PaginationMeta }> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.platform_id) params.set("platform_id", filters.platform_id);
    if (filters?.product_type) params.set("product_type", filters.product_type);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.inventory_status) params.set("inventory_status", filters.inventory_status);
    if (filters?.price_min !== undefined) params.set("price_min", String(filters.price_min));
    if (filters?.price_max !== undefined) params.set("price_max", String(filters.price_max));
    if (filters?.sort) params.set("sort", filters.sort);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const cacheKey = `products:${params.toString()}`
    const cached = getCached<{ data: ProductWithDetails[]; pagination: PaginationMeta }>(cacheKey)
    if (cached) return cached

    const response = await apiClient.get(`/products?${params.toString()}`);
    setCache(cacheKey, response.data)
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener productos"));
  }
}

export async function getProductById(id: string): Promise<ProductWithDetails> {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener producto"));
  }
}

export async function getProductMetrics(id: string): Promise<ProductMetrics> {
  try {
    const response = await apiClient.get(`/products/${id}/metrics`);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener métricas del producto"));
  }
}

export async function getProductAnalytics(): Promise<ProductAnalytics> {
  try {
    const response = await apiClient.get("/products/analytics");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener analytics de productos"));
  }
}

export async function getProductHealth(): Promise<ProductHealth> {
  try {
    const response = await apiClient.get("/products/health");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "obtener salud del inventario"));
  }
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  try {
    const response = await apiClient.post("/products", data);
    clearProductCache()
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "crear producto"));
  }
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
  try {
    const response = await apiClient.put(`/products/${id}`, data);
    clearProductCache()
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "actualizar producto"));
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiClient.delete(`/products/${id}`);
    clearProductCache()
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "eliminar producto"));
  }
}

export async function duplicateProduct(id: string): Promise<Product> {
  try {
    const response = await apiClient.post(`/products/${id}/duplicate`);
    clearProductCache()
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "duplicar producto"));
  }
}

export async function bulkAction(data: BulkAction): Promise<{ updated?: number; deleted?: number }> {
  try {
    const response = await apiClient.put("/products/bulk", data);
    clearProductCache()
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error as AxiosError, "ejecutar acción masiva"));
  }
}
