"use client"

import { useState, useEffect } from "react"
import { getActivePlatforms, type Platform } from "@/lib/api/platforms"

let cachedPlatforms: Platform[] | null = null
let cachePromise: Promise<Platform[]> | null = null

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>(cachedPlatforms ?? [])
  const [loading, setLoading] = useState(cachedPlatforms === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cachedPlatforms) {
      setPlatforms(cachedPlatforms)
      setLoading(false)
      return
    }

    if (!cachePromise) {
      cachePromise = getActivePlatforms()
    }

    let cancelled = false

    cachePromise
      .then((data) => {
        if (cancelled) return
        cachedPlatforms = data
        setPlatforms(data)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Error loading platforms")
        cachePromise = null
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { platforms, loading, error }
}
