"use client"

import Link from "next/link"
import { BrandingSection } from "@/components/organisms/branding-section"
import { LoginFormCard } from "@/components/organisms/login-form-card"
import { Button } from "@/components/atoms/button"
import { ArrowLeft } from "lucide-react"

export function LoginTemplate() {
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
        <BrandingSection />
        <section className="flex-1 md:w-1/2 flex items-center justify-center p-6 relative">
          <LoginFormCard />
        </section>
      </main>
    </div>
  )
}
