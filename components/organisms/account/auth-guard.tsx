'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/session-context'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSession()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/web/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) return null

  return <>{children}</>
}
