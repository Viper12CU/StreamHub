import useSWR from "swr"
import { useMemo } from "react"
import { swrFetcher, buildQS } from "../swr-config"
import type {
  InventoryWithDetails,
  InventoryFilters,
  InventoryStats,
  InventoryHealth,
  LowStockItem,
  PaginationMeta,
} from "../inventory"

const PREFIX = "/inventory"

// ─── SWR Keys ──────────────────────────────────────────

export const inventoryKeys = {
  list: (filters: InventoryFilters) =>
    `${PREFIX}?${buildQS({ ...filters })}` as const,
  stats: () => `${PREFIX}/stats` as const,
  health: () => `${PREFIX}/health` as const,
  lowStock: () => `${PREFIX}/low-stock` as const,
  tabCount: (assetType: string) =>
    `${PREFIX}?${buildQS({ asset_type: assetType, limit: 1 })}` as const,
}

// ─── Hooks ─────────────────────────────────────────────

interface InventoryListResponse {
  data: InventoryWithDetails[]
  pagination: PaginationMeta
}

export function useSWRInventory(filters: InventoryFilters) {
  const key = useMemo(() => inventoryKeys.list(filters), [JSON.stringify(filters)])
  const { data: raw, error, isLoading, mutate } = useSWR<InventoryListResponse>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })
  return { data: raw?.data ?? [], pagination: raw?.pagination, error, isLoading, mutate }
}

export function useSWRInventoryStats() {
  const { data: raw, error, isLoading, mutate } = useSWR<{ data: InventoryStats }>(
    inventoryKeys.stats(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading, mutate }
}

export function useSWRInventoryHealth() {
  const { data: raw, error, isLoading } = useSWR<{ data: InventoryHealth }>(
    inventoryKeys.health(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading }
}

export function useSWRLowStock() {
  const { data: raw, error, isLoading } = useSWR<{ data: LowStockItem[] }>(
    inventoryKeys.lowStock(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? [], error, isLoading }
}

interface InventoryTabCountResponse {
  pagination: PaginationMeta
}

export function useSWRInventoryTabCount(assetType: string) {
  const key = useMemo(() => inventoryKeys.tabCount(assetType), [assetType])
  const { data: raw, isLoading } = useSWR<InventoryTabCountResponse>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })
  return { count: raw?.pagination?.total ?? 0, isLoading }
}
