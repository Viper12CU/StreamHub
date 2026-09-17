import useSWR from "swr"
import { useMemo } from "react"
import { swrFetcher, buildQS } from "../swr-config"
import type {
  CreditAccountWithUser,
  CreditAccountFilters,
  CreditStats,
  CreditAnalyticsData,
  PaginationMeta,
} from "../credits"

const PREFIX = "/credits"

// ─── SWR Keys ──────────────────────────────────────────

export const creditKeys = {
  accounts: (filters: CreditAccountFilters, page: number, limit: number) =>
    `${PREFIX}/accounts?${buildQS({ ...filters, page, limit })}` as const,
  stats: () => `${PREFIX}/stats` as const,
  analytics: () => `${PREFIX}/analytics` as const,
}

// ─── Hooks ─────────────────────────────────────────────

interface CreditAccountsResponse {
  data: CreditAccountWithUser[]
  pagination: PaginationMeta
}

export function useSWRCreditAccounts(filters: CreditAccountFilters, page: number, limit = 50) {
  const key = useMemo(() => creditKeys.accounts(filters, page, limit), [JSON.stringify(filters), page, limit])
  const { data: raw, error, isLoading, mutate } = useSWR<CreditAccountsResponse>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })
  return { data: raw?.data ?? [], pagination: raw?.pagination, error, isLoading, mutate }
}

export function useSWRCreditStats() {
  const { data: raw, error, isLoading, mutate } = useSWR<{ data: CreditStats }>(
    creditKeys.stats(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading, mutate }
}

export function useSWRCreditAnalytics() {
  const { data: raw, error, isLoading } = useSWR<{ data: CreditAnalyticsData }>(
    creditKeys.analytics(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: raw?.data ?? null, error, isLoading }
}
