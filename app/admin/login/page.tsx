"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { FormField } from "@/components/molecules/form-field"
import { Button } from "@/components/atoms/button"
import { signIn, getSession, setSessionToken } from "@/lib/api/auth"
import { Icon } from "@/components/atoms/icon"
import { sileo } from "sileo"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const emailValid = email.includes("@") && email.includes(".")
  const passwordValid = password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailValid || !passwordValid) return

    setLoading(true)
    setError("")

    try {
      const res = await signIn({ email, password })
      if (res?.token) setSessionToken(res.token)
      await getSession()
      sileo.success({ title: "Sesion iniciada", description: "Bienvenido al Admin Portal." })
      router.push("/admin")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Credenciales invalidas"
      setError(msg)
      sileo.error({ title: "Error al iniciar sesion", description: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mx-auto glow-red">
            <Icon name="cloud-sync" className="text-on-primary-container text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">StreamHub</h1>
            <p className="text-sm text-on-surface-variant mt-1">Admin Portal</p>
          </div>
        </div>

        <div className="bg-[#1A1A2E] rounded-xl p-10 glass-panel shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1 mb-8">
              <h2 className="text-xl font-semibold text-on-surface">Iniciar Sesion</h2>
              <p className="text-sm text-on-surface-variant">Ingresa tus credenciales de administrador</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error-container/20 border border-error/20">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <FormField
              label="Correo Electronico"
              icon={Mail}
              type="email"
              placeholder="admin@streamhub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              valid={email.length > 0 && emailValid}
            />

            <FormField
              label="Contrasena"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              valid={passwordValid}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />

            <Button type="submit" className="w-full py-4 text-xl font-semibold" loading={loading}>
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-on-surface-variant/50">
          StreamHub Admin Portal &copy; 2024
        </p>
      </div>
    </div>
  )
}
