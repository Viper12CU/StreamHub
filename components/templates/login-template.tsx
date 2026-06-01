"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BrandingSection } from "@/components/organisms/branding-section"
import { LoginFormCard } from "@/components/organisms/login-form-card"
import { Button } from "@/components/atoms/button"
import { ArrowLeft } from "lucide-react"
import { sileo } from "sileo";

export function LoginTemplate() {
  const router = useRouter()
  const handleLoginSuccess = useCallback(() => {
    sileo.success({
      title: "Inicio de sesión exitoso",
      description:
        "Bienvenido de nuevo a StreamHub. Disfruta de tu experiencia de streaming!",
    })
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-8 px-4 md:px-10 absolute z-10">
        <Link href="/">
          <Button variant="secondary" size="sm" className="rounded-full px-5">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
      </div>
      
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel: Decorative Branding */}
        <BrandingSection />
        
        {/* Right Panel: Form Card */}
        <section className="flex-1 md:w-1/2 flex items-center justify-center p-6 relative">
          <LoginFormCard onSuccess={handleLoginSuccess} />
        </section>
      </main>
    </div>
  )
}
