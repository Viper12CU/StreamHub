import axios from "@/lib/axios"

// ─── Types ──────────────────────────────────────────────────────────────────

export type InventoryStatus = "available" | "reserved" | "assigned" | "expired" | "suspended"

export type AssetType = "account" | "profile" | "code" | "package"

export interface InventoryMetadata {
  asset_type: AssetType
  email?: string
  password?: string
  recovery_email?: string
  profile_name?: string
  parent_account?: string
  pin?: string
  activation_code?: string
  license_key?: string
  notes?: string
}

export interface InventoryItem {
  id: string
  product_id: string
  serial_key: string | null
  status: InventoryStatus
  assigned_to: string | null
  expires_at: string | null
  metadata: InventoryMetadata | null
  created_at: string
  updated_at: string
}

export interface InventoryWithDetails extends InventoryItem {
  product_name: string
  product_type: string
  platform_name: string
  platform_id: string
  platform_color: string | null
  platform_slug: string
  customer_name: string | null
  days_remaining: number | null
  identifier: string
}

export interface CreateInventoryInput {
  product_id: string
  serial_key?: string
  status?: InventoryStatus
  assigned_to?: string
  expires_at?: string
  metadata?: InventoryMetadata
}

export interface UpdateInventoryInput {
  serial_key?: string
  status?: InventoryStatus
  assigned_to?: string
  expires_at?: string
  metadata?: InventoryMetadata
}

export interface InventoryFilters {
  search?: string
  product_id?: string
  platform_id?: string
  status?: InventoryStatus
  asset_type?: AssetType
  expiration_start?: string
  expiration_end?: string
  sort?: InventorySortOption
  page?: number
  limit?: number
}

export type InventorySortOption = "recent" | "expiration" | "platform" | "status"

export interface InventoryStats {
  total_assets: number
  available: number
  reserved: number
  assigned: number
  expired: number
  suspended: number
  low_stock_products: number
}

export interface InventoryHealthDistribution {
  label: string
  count: number
  percentage: number
}

export interface InventoryHealthByPlatform {
  name: string
  count: number
}

export interface InventoryHealthExpiring {
  id: string
  product: string
  days: number
  status: string
}

export interface InventoryHealth {
  distribution: InventoryHealthDistribution[]
  byPlatform: InventoryHealthByPlatform[]
  expiring: InventoryHealthExpiring[]
}

export interface LowStockItem {
  product: string
  platform: string
  remaining: number
  threshold: number
}

export interface InventoryActivity {
  id: string
  action: string
  detail: string
  admin: string
  timestamp: string
  metadata: Record<string, unknown> | null
}

export interface PendingOrder {
  id: string
  order_number: string
  customer: string
  product: string
  platform: string
}

export interface CompatibleAsset {
  id: string
  platform: string
  identifier: string
  expiration: string | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ─── Cache (30s) ────────────────────────────────────────────────────────────

const cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 30_000

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T
  cache.delete(key)
  return null
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() })
}

export function clearInventoryCache() {
  cache.clear()
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function getInventory(filters: InventoryFilters = {}): Promise<{ data: InventoryWithDetails[]; pagination: PaginationMeta }> {
  const params = new URLSearchParams()
  if (filters.search) params.set("search", filters.search)
  if (filters.product_id) params.set("product_id", filters.product_id)
  if (filters.platform_id) params.set("platform_id", filters.platform_id)
  if (filters.status) params.set("status", filters.status)
  if (filters.asset_type) params.set("asset_type", filters.asset_type)
  if (filters.expiration_start) params.set("expiration_start", filters.expiration_start)
  if (filters.expiration_end) params.set("expiration_end", filters.expiration_end)
  if (filters.sort) params.set("sort", filters.sort)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))

  const qs = params.toString()
  const cacheKey = `inventory:list:${qs}`
  const cached = getCached<{ data: InventoryWithDetails[]; pagination: PaginationMeta }>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get(`/inventory?${qs}`)
  const result = { data: data.data, pagination: data.pagination }
  setCache(cacheKey, result)
  return result
}

export async function getInventoryItem(id: string): Promise<InventoryWithDetails> {
  const cacheKey = `inventory:item:${id}`
  const cached = getCached<InventoryWithDetails>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get(`/inventory/${id}`)
  setCache(cacheKey, data.data)
  return data.data
}

export async function getInventoryStats(): Promise<InventoryStats> {
  const cacheKey = "inventory:stats"
  const cached = getCached<InventoryStats>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get("/inventory/stats")
  setCache(cacheKey, data.data)
  return data.data
}

export async function getInventoryHealth(): Promise<InventoryHealth> {
  const cacheKey = "inventory:health"
  const cached = getCached<InventoryHealth>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get("/inventory/health")
  setCache(cacheKey, data.data)
  return data.data
}

export async function getLowStock(): Promise<LowStockItem[]> {
  const cacheKey = "inventory:low-stock"
  const cached = getCached<LowStockItem[]>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get("/inventory/low-stock")
  setCache(cacheKey, data.data)
  return data.data
}

export async function getInventoryActivity(limit = 20): Promise<InventoryActivity[]> {
  const cacheKey = `inventory:activity:${limit}`
  const cached = getCached<InventoryActivity[]>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get(`/inventory/activity?limit=${limit}`)
  setCache(cacheKey, data.data)
  return data.data
}

export async function getPendingOrders(): Promise<PendingOrder[]> {
  const cacheKey = "inventory:pending-orders"
  const cached = getCached<PendingOrder[]>(cacheKey)
  if (cached) return cached

  const { data } = await axios.get("/inventory/pending-orders")
  setCache(cacheKey, data.data)
  return data.data
}

export async function getCompatibleAssets(orderId: string): Promise<CompatibleAsset[]> {
  const { data } = await axios.get(`/inventory/compatible-assets/${orderId}`)
  return data.data
}

export async function createInventoryItem(input: CreateInventoryInput): Promise<InventoryItem> {
  const { data } = await axios.post("/inventory", input)
  clearInventoryCache()
  return data.data
}

export async function updateInventoryItem(id: string, input: UpdateInventoryInput): Promise<InventoryItem> {
  const { data } = await axios.put(`/inventory/${id}`, input)
  clearInventoryCache()
  return data.data
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await axios.delete(`/inventory/${id}`)
  clearInventoryCache()
}

export async function bulkInventoryAction(payload: {
  ids: string[]
  action: "delete" | "status" | "assign" | "export"
  status?: InventoryStatus
  order_id?: string
}): Promise<{ deleted?: number; updated?: number }> {
  const { data } = await axios.post("/inventory/bulk", payload)
  clearInventoryCache()
  return data.data
}

export async function autoAssignInventory(orderId: string): Promise<InventoryItem> {
  const { data } = await axios.post("/inventory/auto-assign", { order_id: orderId })
  clearInventoryCache()
  return data.data
}

export async function assignInventory(inventoryId: string, orderId: string): Promise<InventoryItem> {
  const { data } = await axios.patch(`/inventory/${inventoryId}/assign`, { order_id: orderId })
  clearInventoryCache()
  return data.data
}
