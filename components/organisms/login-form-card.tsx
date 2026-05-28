"use client"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { TabSwitcher } from "@/components/molecules/tab-switcher"
import { FormField } from "@/components/molecules/form-field"
import { PulseIndicator } from "@/components/atoms/pulse-indicator"
import { Button } from "@/components/atoms/button"
import Link from "next/link"

interface LoginFormCardProps {
  onSuccess?: () => void
}

export function LoginFormCard({ onSuccess }: LoginFormCardProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("usuario@stream")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  
  const emailError = email && !email.includes("@") ? "Correo invalido" : 
                     email && !email.includes(".") ? "Correo invalido" : undefined
  const passwordValid = password.length >= 8

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailError && passwordValid) {
      onSuccess?.()
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1A1A2E] rounded-xl p-10 glass-panel shadow-2xl">
      {/* Tab Switcher */}
      <div className="mb-8">
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Login Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <FormField
          label="Correo Electronico"
          icon={Mail}
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        
        {/* Password Field */}
        <FormField
          label="Contrasena"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          valid={passwordValid}
          rightAction={
            <Link 
              href="#" 
              className="text-xs font-semibold tracking-wider text-secondary hover:underline"
            >
              Olvidaste tu contrasena?
            </Link>
          }
          rightIcon={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          }
        />
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full py-4 text-xl font-semibold"
        >
          Iniciar sesion
        </Button>
        
        {/* Switch Link */}
        <div className="text-center pt-4">
          <p className="text-base text-muted-foreground">
            No tienes cuenta?{" "}
            <button 
              type="button"
              onClick={() => setActiveTab("register")}
              className="text-primary font-bold hover:underline"
            >
              Registrate
            </button>
          </p>
        </div>
      </form>
      
      {/* Status Indicator */}
      <div className="mt-10">
        <PulseIndicator label="Entrega instantanea 24/7 disponible" />
      </div>
    </div>
  )
}
