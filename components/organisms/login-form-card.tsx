"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { FormField } from "@/components/molecules/form-field"
import { PulseIndicator } from "@/components/atoms/pulse-indicator"
import { Button } from "@/components/atoms/button"
import { signIn, signUp, setSessionToken } from "@/lib/api/auth"
import { useSession } from "@/lib/session-context"
import { sileo } from "sileo"
import Link from "next/link"

export function LoginFormCard() {
  const router = useRouter()
  const { setSession, fetchAndSetSession } = useSession()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [fullName, setFullName] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const loginEmailError =
    loginEmail && !loginEmail.includes("@")
      ? "Correo invalido"
      : loginEmail && !loginEmail.includes(".")
        ? "Correo invalido"
        : undefined
  const registerEmailError =
    registerEmail && !registerEmail.includes("@")
      ? "Correo invalido"
      : registerEmail && !registerEmail.includes(".")
        ? "Correo invalido"
        : undefined
  const loginPasswordValid = loginPassword.length >= 8
  const registerPasswordValid = registerPassword.length >= 8
  const confirmPasswordValid = confirmPassword.length >= 8 && confirmPassword === registerPassword
  const fullNameValid = fullName.trim().length >= 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isLogin = activeTab === "login"
    const canSubmit = isLogin
      ? !loginEmailError && loginPasswordValid && loginEmail.length > 0
      : fullNameValid && !registerEmailError && registerPasswordValid && confirmPasswordValid

    if (!canSubmit) return

    setLoading(true)

    try {
      if (isLogin) {
        const res = await signIn({ email: loginEmail, password: loginPassword })
        if (res?.token) setSessionToken(res.token)
        await fetchAndSetSession()
        sileo.success({
          title: "Inicio de sesion exitoso",
          description: "Bienvenido de nuevo a StreamHub.",
        })
        router.push("/account")
      } else {
        await signUp({ email: registerEmail, password: registerPassword, name: fullName })
        sileo.success({
          title: "Cuenta creada exitosamente",
          description: "Tu cuenta ha sido creada. Ahora inicia sesion.",
        })
        setActiveTab("login")
      }
    } catch (error) {
      sileo.error({
        title: isLogin ? "Error al iniciar sesion" : "Error al crear cuenta",
        description: error instanceof Error ? error.message : "Ocurrio un error inesperado.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1A1A2E] rounded-xl p-10 glass-panel shadow-2xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {activeTab === "login" ? (
          <div className="space-y-6">
            <FormField
              label="Correo Electronico"
              icon={Mail}
              type="email"
              placeholder="tu@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              error={loginEmailError}
            />

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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
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
            <FormField
              label="Correo Electronico"
              icon={Mail}
              type="email"
              placeholder="tu@email.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              error={registerEmailError}
            />

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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              }
            />
          </div>
        )}

        <Button type="submit" className="w-full py-4 text-xl font-semibold" disabled={loading}>
          {loading
            ? "Cargando..."
            : activeTab === "login"
              ? "Iniciar sesion"
              : "Crear cuenta"}
        </Button>

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

      <div className="mt-10">
        <PulseIndicator label="Entrega instantanea 24/7 disponible" />
      </div>
    </div>
  )
}
