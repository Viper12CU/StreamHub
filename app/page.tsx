"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HomeTemplate } from "@/components/templates/home-template"

export default function HomePage() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const sessionFlag = localStorage.getItem("streamhub_session")
    if (sessionFlag === "true") {
      router.replace("/account")
      return
    }
    setIsReady(true)
  }, [router])

  if (!isReady) return null

  return <HomeTemplate />
}
