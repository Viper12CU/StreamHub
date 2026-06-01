"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/atoms/logo"
import { NavLink } from "@/components/atoms/nav-link"
import { Button } from "@/components/atoms/button"

const navItems = [
  { href: "/", label: "Inicio", type: "page" as const },
  { href: "/#catalogo", label: "Catálogo", type: "section" as const, sectionId: "catalogo" },
  { href: "/#how", label: "Cómo funciona", type: "section" as const, sectionId: "how" },
  { href: "/#precios", label: "Precios", type: "section" as const, sectionId: "precios" },
  { href: "/#contacto", label: "Contacto", type: "section" as const, sectionId: "contacto" },
  { href: "/catalog", label: "Planes", type: "page" as const },
]

export function Navbar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null)
      return
    }

    const sectionIds = navItems
      .filter((item) => item.type === "section" && item.sectionId)
      .map((item) => item.sectionId as string)

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    const updateAuthState = () => {
      const sessionFlag = localStorage.getItem("streamhub_session")
      setIsLoggedIn(sessionFlag === "true")
    }

    updateAuthState()
    window.addEventListener("storage", updateAuthState)
    window.addEventListener("streamhub-auth-change", updateAuthState)

    return () => {
      window.removeEventListener("storage", updateAuthState)
      window.removeEventListener("streamhub-auth-change", updateAuthState)
    }
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 px-4 md:px-10 py-6">
      <nav className="max-w-7xl mx-auto bg-background/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex justify-between items-center transition-all">
        <Logo className="text-xl" />

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.type === "page"
                ? pathname === item.href || (item.href === "/" && pathname === "/" && !activeSection)
                : pathname === "/" && activeSection === item.sectionId

            if (item.type === "page") {
              return (
                <NavLink key={item.href} href={item.href} isActive={isActive}>
                  {item.label}
                </NavLink>
              )
            }

            return (
              <NavLink key={item.href} href={item.href} isActive={isActive}>
                {item.label}
              </NavLink>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/account">
              <Button size="sm" className="rounded-full px-6">Mi Cuenta</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm" className="rounded-full px-5">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
