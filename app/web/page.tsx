"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HomeTemplate } from "@/components/templates/home-template"
import { useSession } from "@/lib/session-context"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSession()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/web/account")
      return
    }
    if (!isLoading) setReady(true)
  }, [isLoading, isAuthenticated, router])

  if (!ready) return null

  return <HomeTemplate />
}
