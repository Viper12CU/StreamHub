import useSWR from "swr"
import { swrFetcher } from "../swr-config"
import type { WishlistItem } from "../wishlist"

// ─── SWR Keys ──────────────────────────────────────────

export const wishlistKeys = {
  my: () => "/wishlists/my",
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
