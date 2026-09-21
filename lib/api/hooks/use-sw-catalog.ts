import useSWR from "swr"
import { useMemo } from "react"
import { swrFetcher, buildQS } from "../swr-config"
import type { ProductWithDetails, PaginationMeta } from "../products"

const PREFIX = "/products"

// ─── SWR Keys ──────────────────────────────────────────

export const catalogKeys = {
  products: (filters: Record<string, string | number | boolean | null | undefined>, page: number, limit: number) =>
    `${PREFIX}?${buildQS({ ...filters, page, limit })}` as const,
}

// ─── Hooks ─────────────────────────────────────────────

interface ProductListResponse {
  data: ProductWithDetails[]
  pagination: PaginationMeta
}

export function useSWRCatalogProducts(
  filters: Record<string, string | number | boolean | null | undefined>,
  page: number,
  limit = 24
) {
  const key = useMemo(() => catalogKeys.products(filters, page, limit), [JSON.stringify(filters), page, limit])
  const { data: raw, error, isLoading, mutate } = useSWR<ProductListResponse>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })
  return { data: raw?.data ?? [], pagination: raw?.pagination, error, isLoading, mutate }
}
