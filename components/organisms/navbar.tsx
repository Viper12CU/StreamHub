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
  { href: "/catalogo", label: "Planes", type: "page" as const },
]

export function Navbar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string | null>(null)

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
          <Link href="/login">
            <Button variant="secondary" size="sm" className="rounded-full px-5">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/checkout">
            <Button size="sm" className="rounded-full px-6">Mi Cuenta</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
