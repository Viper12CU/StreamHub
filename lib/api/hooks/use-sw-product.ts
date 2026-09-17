import useSWR from "swr"
import { useMemo } from "react"
import { swrFetcher, buildQS } from "../swr-config"
import type {
  ProductWithDetails,
  ProductFilters,
  ProductAnalytics,
  ProductHealth,
  PaginationMeta,
} from "../products"

const PREFIX = "/products"

// ─── SWR Keys ──────────────────────────────────────────

export const productKeys = {
  list: (filters: ProductFilters, page: number, limit: number) =>
    `${PREFIX}?${buildQS({ ...filters, page, limit })}` as const,
  analytics: () => `${PREFIX}/analytics` as const,
  health: () => `${PREFIX}/health` as const,
}

// ─── Hooks ─────────────────────────────────────────────

interface ProductListResponse {
  data: ProductWithDetails[]
  pagination: PaginationMeta
}

export function useSWRProducts(filters: ProductFilters, page: number, limit = 10) {
  const key = useMemo(() => productKeys.list(filters, page, limit), [JSON.stringify(filters), page, limit])
  const { data: raw, error, isLoading, mutate } = useSWR<ProductListResponse>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })
  return { data: raw?.data ?? [], pagination: raw?.pagination, error, isLoading, mutate }
}

export function useSWRProductAnalytics() {
  const { data: raw, error, isLoading } = useSWR<{ data: ProductAnalytics }>(
    productKeys.analytics(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading }
}

export function useSWRProductHealth() {
  const { data: raw, error, isLoading } = useSWR<{ data: ProductHealth }>(
    productKeys.health(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading }
}
