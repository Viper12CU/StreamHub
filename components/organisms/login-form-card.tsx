"use client"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { FormField } from "@/components/molecules/form-field"
import { PulseIndicator } from "@/components/atoms/pulse-indicator"
import { Button } from "@/components/atoms/button"
import Link from "next/link"

interface LoginFormCardProps {
  onSuccess?: () => void
}

export function LoginFormCard({ onSuccess }: LoginFormCardProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [fullName, setFullName] = useState("")
  const [loginEmail, setLoginEmail] = useState("usuario@stream")
  const [loginPassword, setLoginPassword] = useState("password123")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const loginEmailError = loginEmail && !loginEmail.includes("@") ? "Correo invalido" : 
                     loginEmail && !loginEmail.includes(".") ? "Correo invalido" : undefined
  const registerEmailError = registerEmail && !registerEmail.includes("@") ? "Correo invalido" : 
                     registerEmail && !registerEmail.includes(".") ? "Correo invalido" : undefined
  const loginPasswordValid = loginPassword.length >= 8
  const registerPasswordValid = registerPassword.length >= 8
  const confirmPasswordValid = confirmPassword.length >= 8 && confirmPassword === registerPassword
  const fullNameValid = fullName.trim().length >= 3

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isLogin = activeTab === "login"
    const canSubmit = isLogin
      ? !loginEmailError && loginPasswordValid
      : fullNameValid && !registerEmailError && registerPasswordValid && confirmPasswordValid

    if (canSubmit) {
      localStorage.setItem("streamhub_session", "true")
      window.dispatchEvent(new Event("streamhub-auth-change"))
      onSuccess?.()
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1A1A2E] rounded-xl p-10 glass-panel shadow-2xl">
      {/* Login/Register Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {activeTab === "login" ? (
          <div className="space-y-6">
            {/* Email Field */}
            <FormField
              label="Correo Electronico"
              icon={Mail}
              type="email"
              placeholder="tu@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              error={loginEmailError}
            />
            
            {/* Password Field */}
            <FormField
              label="Contrasena"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              valid={loginPasswordValid}
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
          </div>
        ) : (
          <div className="space-y-6">
            <FormField
              label="Nombre completo"
              icon={User}
              type="text"
              placeholder="Tu nombre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              valid={fullNameValid}
            />
            {/* Email Field */}
            <FormField
              label="Correo Electronico"
              icon={Mail}
              type="email"
              placeholder="tu@email.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              error={registerEmailError}
            />
            
            {/* Password Field */}
            <FormField
              label="Contrasena"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              valid={registerPasswordValid}
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
            
            <FormField
              label="Confirmar Contrasena"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              valid={confirmPasswordValid}
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
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full py-4 text-xl font-semibold"
        >
          {activeTab === "login" ? "Iniciar sesion" : "Crear cuenta"}
        </Button>
        
        {/* Switch Link */}
        <div className="text-center pt-4">
          {activeTab === "login" ? (
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
          ) : (
            <p className="text-base text-muted-foreground">
              Ya tienes cuenta?{" "}
              <button 
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-primary font-bold hover:underline"
              >
                Entrar
              </button>
            </p>
          )}
        </div>
      </form>
      
      {/* Status Indicator */}
      <div className="mt-10">
        <PulseIndicator label="Entrega instantanea 24/7 disponible" />
      </div>
    </div>
  )
}
