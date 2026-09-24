"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { sileo } from "sileo"
import { useSession } from "@/lib/session-context"
import { addToWishlist, removeFromWishlist } from "../wishlist"
import { useSWRWishlistIds } from "./use-sw-wishlist"

export function useWishlist() {
  const { isAuthenticated, isLoading: sessionLoading } = useSession()
  const router = useRouter()
  const [isToggling, setIsToggling] = useState(false)
  const pendingRef = useRef(false)

  const { data: ids, isLoading: idsLoading, mutate } = useSWRWishlistIds(isAuthenticated)

  const isInWishlist = (productId: string) => ids.includes(productId)

  const toggle = async (productId: string): Promise<boolean | null> => {
    if (sessionLoading) return null

    if (!isAuthenticated) {
      router.push("/web/login")
      return null
    }

    if (pendingRef.current) return null
    pendingRef.current = true
    setIsToggling(true)

    const willAdd = !ids.includes(productId)

    try {
      if (willAdd) {
        await addToWishlist(productId)
        await mutate({ data: [...ids, productId] }, { revalidate: false })
      } else {
        await removeFromWishlist(productId)
        await mutate(
          { data: ids.filter((id) => id !== productId) },
          { revalidate: false }
        )
      }
      return willAdd
    } catch (error) {
      sileo.error({
        title: "Wishlist",
        description:
          error instanceof Error ? error.message : "No se pudo actualizar tu wishlist",
      })
      void mutate()
      return null
    } finally {
      pendingRef.current = false
      setIsToggling(false)
    }
  }

  return {
    isAuthenticated,
    isLoading: sessionLoading || (isAuthenticated && idsLoading),
    isToggling,
    isInWishlist,
    toggle,
  }
}
