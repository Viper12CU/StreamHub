import useSWR from "swr"
import { swrFetcher } from "../swr-config"
import type { MyProfile, MyOrder, MyCreditBalance, MyCreditTransaction, CreditPaginationMeta } from "../account"

const PREFIX_PROFILE = "/customers/me"
const PREFIX_ORDERS = "/orders/my"
const PREFIX_CREDITS = "/credits/me"
const PREFIX_CREDIT_TX = "/credits/me/transactions"

// ─── SWR Keys ──────────────────────────────────────────

export const accountKeys = {
  profile: () => PREFIX_PROFILE,
  orders: () => PREFIX_ORDERS,
  creditBalance: () => PREFIX_CREDITS,
  creditTransactions: (page: number, limit: number) =>
    `${PREFIX_CREDIT_TX}?page=${page}&limit=${limit}` as const,
}

// ─── Hooks ─────────────────────────────────────────────

export function useSWRAccountProfile() {
  const { data, error, isLoading, mutate } = useSWR<{ data: MyProfile }>(
    accountKeys.profile(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: data?.data ?? null, error, isLoading, mutate }
}

export function useSWRAccountOrders() {
  const { data, error, isLoading, mutate } = useSWR<{ data: MyOrder[] }>(
    accountKeys.orders(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: data?.data ?? [], error, isLoading, mutate }
}

export function useSWRAccountCreditBalance() {
  const { data, error, isLoading, mutate } = useSWR<{ data: MyCreditBalance }>(
    accountKeys.creditBalance(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  return { data: data?.data ?? null, error, isLoading, mutate }
}

interface CreditTransactionsResponse {
  data: MyCreditTransaction[]
  pagination: CreditPaginationMeta
}

export function useSWRMyCreditTransactions(page: number, limit = 20) {
  const key = `${PREFIX_CREDIT_TX}?page=${page}&limit=${limit}`
  const { data: raw, error, isLoading, mutate } = useSWR<CreditTransactionsResponse>(
    key,
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  return { data: raw?.data ?? [], pagination: raw?.pagination, error, isLoading, mutate }
}
