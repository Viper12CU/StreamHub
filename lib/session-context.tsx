"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getSession } from "@/lib/api/auth"

interface SessionUser {
  id?: string
  email: string
  name: string
  image?: string | null
}

interface SessionData {
  token: string
  expiresAt: string
}

interface SessionContextValue {
  user: SessionUser | null
  session: SessionData | null
  isLoading: boolean
  isAuthenticated: boolean
  setSession: (user: SessionUser, session: SessionData) => void
  clearSession: () => void
  fetchAndSetSession: () => Promise<boolean>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [session, setSessionState] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSession()
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
          setSessionState(data.session)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const fetchAndSetSession = useCallback(async () => {
    try {
      const data = await getSession()
      if (data?.user) {
        setUser(data.user)
        setSessionState(data.session)
        return true
      }
    } catch {}
    return false
  }, [])

  const setSession = useCallback((u: SessionUser, s: SessionData) => {
    setUser(u)
    setSessionState(s)
  }, [])

  const clearSession = useCallback(() => {
    setUser(null)
    setSessionState(null)
  }, [])

  return (
    <SessionContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        setSession,
        clearSession,
        fetchAndSetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider")
  return ctx
}
