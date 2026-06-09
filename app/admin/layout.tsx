"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/organisms/admin/admin-sidebar"
import { AdminTopBar } from "@/components/organisms/admin/admin-top-bar"
import { AdminBottomBar } from "@/components/organisms/admin/admin-bottom-bar"
import { useIsMobile } from "@/hooks/use-mobile"
import { getSession } from "@/lib/api/auth"
import { sileo } from "sileo"

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

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading || !isAuthenticated || !isAdmin) {
    return null
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
            <p className="text-xs">&copy; 2024 StreamHub Admin Portal. All rights reserved.</p>
          </footer>
        </main>

        <AdminBottomBar />
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[280px]"}`}>
        <AdminTopBar collapsed={collapsed} />

        <section className="mt-20 p-8 flex flex-col gap-6 animate-in fade-in duration-700">
          {children}
        </section>

        <footer className="mt-auto p-6 text-center opacity-30">
          <p className="text-xs">&copy; 2024 StreamHub Admin Portal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
