import useSWR from "swr"
import { useMemo } from "react"
import { swrFetcher, buildQS } from "../swr-config"
import type {
  Customer,
  CustomerFilters,
  CustomerAnalyticsData,
  CustomerInsightItem,
  CustomerCounts,
  PaginationMeta,
} from "../customers"

const PREFIX = "/customers"

// ─── SWR Keys ──────────────────────────────────────────

export const customerKeys = {
  list: (filters: CustomerFilters, page: number, limit: number) =>
    `${PREFIX}?${buildQS({ ...filters, page, limit })}` as const,
  stats: () => `${PREFIX}/stats` as const,
  analytics: () => `${PREFIX}/analytics` as const,
  insights: () => `${PREFIX}/insights` as const,
}

// ─── Hooks ─────────────────────────────────────────────

interface CustomerListResponse {
  data: Customer[]
  pagination: PaginationMeta
}

export function useSWRCustomers(filters: CustomerFilters, page: number, limit = 50) {
  const key = useMemo(() => customerKeys.list(filters, page, limit), [JSON.stringify(filters), page, limit])
  const { data: raw, error, isLoading, mutate } = useSWR<CustomerListResponse>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })
  return { data: raw?.data ?? [], pagination: raw?.pagination, error, isLoading, mutate }
}

export function useSWRCustomerStats() {
  const { data: raw, error, isLoading, mutate } = useSWR<{ data: Record<string, number> }>(
    customerKeys.stats(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const data: CustomerCounts | null = raw?.data ? {
    all: raw.data.total_customers ?? 0,
    active: raw.data.active ?? 0,
    inactive: raw.data.inactive ?? 0,
    vip: raw.data.vip ?? 0,
    pending: raw.data.churn_risk ?? 0,
    suspended: raw.data.suspended ?? 0,
  } : null
  return { data, error, isLoading, mutate }
}

export function useSWRCustomerAnalytics() {
  const { data: raw, error, isLoading } = useSWR<{ data: CustomerAnalyticsData }>(
    customerKeys.analytics(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading }
}

export function useSWRCustomerInsights() {
  const { data: raw, error, isLoading } = useSWR<{ data: CustomerInsightItem[] }>(
    customerKeys.insights(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading }
}
