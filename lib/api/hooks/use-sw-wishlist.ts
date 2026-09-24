import useSWR from "swr"
import { swrFetcher } from "../swr-config"
import { WISHLIST_SWR_KEYS } from "../wishlist"
import type { WishlistItem } from "../wishlist"

// ─── SWR Keys ──────────────────────────────────────────

export const wishlistKeys = {
  my: () => WISHLIST_SWR_KEYS.my,
  ids: () => WISHLIST_SWR_KEYS.ids,
}

// ─── Hooks ─────────────────────────────────────────────

export function useSWRWishlist() {
  const { data: raw, error, isLoading, mutate } = useSWR<{ data: WishlistItem[] }>(
    wishlistKeys.my(),
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  return { data: raw?.data ?? [], error, isLoading, mutate }
}

export function useSWRWishlistIds(enabled = true) {
  const { data: raw, error, isLoading, mutate } = useSWR<{ data: string[] }>(
    enabled ? wishlistKeys.ids() : null,
    swrFetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  return { data: raw?.data ?? [], error, isLoading, mutate }
}
