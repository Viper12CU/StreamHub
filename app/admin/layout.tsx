"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/organisms/admin/admin-sidebar"
import { AdminTopBar } from "@/components/organisms/admin/admin-top-bar"
import { getSession } from "@/lib/api/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    getSession()
      .then(() => {
        setIsAuthenticated(true)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isLoginPage])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login")
    }
  }, [isLoading, isAuthenticated, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading || !isAuthenticated) {
    return null
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
