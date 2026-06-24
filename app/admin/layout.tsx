"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/organisms/admin/admin-sidebar"
import { AdminTopBar } from "@/components/organisms/admin/admin-top-bar"
import { AdminBottomBar } from "@/components/organisms/admin/admin-bottom-bar"
import { useIsMobile } from "@/hooks/use-mobile"
import { getSession } from "@/lib/api/auth"
import { sileo } from "sileo"

function AdminLoadingSkeleton() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <div className="fixed left-0 top-0 h-screen w-[72px] bg-surface-container border-r border-white/5 animate-pulse" />
      <div className="flex-1 flex flex-col min-h-screen ml-[72px]">
        <div className="fixed top-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-b border-white/10 w-[calc(100%-72px)] animate-pulse" />
        <section className="mt-20 p-8 flex flex-col gap-6">
          <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-surface-container-high rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-surface-container-high rounded-xl animate-pulse" />
        </section>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-sidebar-collapsed") === "true"
    }
    return false
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(collapsed))
  }, [collapsed])

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    getSession()
      .then(({ user }) => {
        const role = user?.role
        if (role === "admin") {
          setIsAuthenticated(true)
          setIsAdmin(true)
        } else {
          setIsAuthenticated(true)
          setIsAdmin(false)
        }
      })
      .catch(() => {
        setIsAuthenticated(false)
        setIsAdmin(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isLoginPage])

  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!isAuthenticated) {
        router.replace("/admin/login")
      } else if (!isAdmin) {
        sileo.error({
          title: "No autorizado",
          description: "No tienes permisos de administrador para acceder a esta seccion.",
        })
        router.replace("/admin/login")
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, isLoginPage, router])

  const handleToggle = useCallback(() => setCollapsed((prev) => !prev), [])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading || !isAuthenticated || !isAdmin) {
    return <AdminLoadingSkeleton />
  }

  if (isMobile) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col min-h-screen pb-20">
          <AdminTopBar collapsed={false} />

          <section className="mt-20 p-4 flex flex-col gap-6 animate-in fade-in duration-700">
            {children}
          </section>

          <footer className="mt-auto p-6 text-center opacity-30">
            <p className="text-xs">&copy; {new Date().getFullYear()} StreamHub Admin Portal. All rights reserved.</p>
          </footer>
        </main>

        <AdminBottomBar />
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <AdminSidebar collapsed={collapsed} onToggle={handleToggle} />

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[280px]"}`}>
        <AdminTopBar collapsed={collapsed} />

        <section className="mt-20 p-8 flex flex-col gap-6 animate-in fade-in duration-700">
          {children}
        </section>

        <footer className="mt-auto p-6 text-center opacity-30">
          <p className="text-xs">&copy; {new Date().getFullYear()} StreamHub Admin Portal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
