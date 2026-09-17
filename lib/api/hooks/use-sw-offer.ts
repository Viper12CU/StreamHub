import useSWR from "swr"
import { useMemo } from "react"
import { swrFetcher, buildQS } from "../swr-config"
import type {
  Offer,
  OfferFilters,
} from "../offers"

const PREFIX = "/offers"

// ─── SWR Keys ──────────────────────────────────────────

export const offerKeys = {
  list: (filters: OfferFilters) =>
    `${PREFIX}?${buildQS({ ...filters })}` as const,
}

// ─── Hooks ─────────────────────────────────────────────

export function useSWROffers(filters: OfferFilters) {
  const key = useMemo(() => offerKeys.list(filters), [JSON.stringify(filters)])
  const { data: raw, error, isLoading, mutate } = useSWR<{ data: Offer[] }>(key, swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })
  return { data: raw?.data ?? [], error, isLoading, mutate }
}
