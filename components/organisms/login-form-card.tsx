"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"
import { FormField } from "@/components/molecules/form-field"
import { PulseIndicator } from "@/components/atoms/pulse-indicator"
import { Button } from "@/components/atoms/button"
import { Icon } from "@/components/atoms/icon"
import { signIn, signUp, setSessionToken } from "@/lib/api/auth"
import { createCustomer } from "@/lib/api/customers"
import { useSession } from "@/lib/session-context"
import { sileo } from "sileo"
import { cn } from "@/lib/utils"
import Link from "next/link"

const countryCodes = [
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+1", country: "EE.UU./Canadá", flag: "🇺🇸" },
  { code: "+52", country: "México", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+34", country: "España", flag: "🇪🇸" },
]

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2 px-1 pt-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex-1 flex items-center gap-1.5">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-200 shrink-0",
            s < currentStep ? "bg-primary text-white" :
            s === currentStep ? "bg-primary text-white ring-3 ring-primary/20" :
            "bg-surface-container-high text-on-surface-variant"
          )}>
            {s < currentStep ? (
              <Icon name="check" className="text-xs" />
            ) : s}
          </div>
          {s < totalSteps && (
            <div className={cn(
              "flex-1 h-0.5 rounded-full transition-colors duration-200",
              s < currentStep ? "bg-primary" : "bg-surface-container-high"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

export function LoginFormCard() {
  const router = useRouter()
  const { fetchAndSetSession } = useSession()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register multi-step state
  const [regStep, setRegStep] = useState(1)
  const [fullName, setFullName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [phoneCode, setPhoneCode] = useState("+53")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Validation
  const loginEmailError = loginEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail) ? "Correo inválido" : undefined
  const loginPasswordValid = loginPassword.length >= 8

  const fullNameValid = fullName.trim().length >= 3
  const registerEmailError = registerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail) ? "Correo inválido" : undefined
  const registerEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)
  const phoneValid = phoneNumber.length >= 6
  const whatsappValid = sameAsPhone || whatsappNumber.length >= 6
  const registerPasswordValid = registerPassword.length >= 8
  const confirmPasswordValid = confirmPassword.length >= 8 && confirmPassword === registerPassword

  const canNextStep1 = fullNameValid && registerEmailValid
  const canNextStep2 = phoneValid && whatsappValid
  const canSubmitStep3 = registerPasswordValid && confirmPasswordValid

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loginEmailError || !loginPasswordValid || !loginEmail.length) return
    setLoading(true)
    try {
      const res = await signIn({ email: loginEmail, password: loginPassword })
      if (res?.token) setSessionToken(res.token)
      await fetchAndSetSession()
      sileo.success({ title: "Inicio de sesión exitoso", description: "Bienvenido de nuevo a StreamHub." })
      router.push("/web/account")
    } catch (error) {
      sileo.error({ title: "Error al iniciar sesión", description: error instanceof Error ? error.message : "Ocurrió un error inesperado." })
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async () => {
    if (!canSubmitStep3) return
    setLoading(true)
    try {
      const result = await signUp({ email: registerEmail, password: registerPassword, name: fullName })
      const userId = result?.user?.id
      if (userId) {
        const fullPhone = `${phoneCode}${phoneNumber}`
        const fullWhatsapp = sameAsPhone ? fullPhone : whatsappNumber ? `${phoneCode}${whatsappNumber}` : undefined
        await createCustomer({
          user_id: userId,
          phone: fullPhone,
          whatsapp: fullWhatsapp,
        })
      }
      sileo.success({ title: "Cuenta creada exitosamente", description: "Tu cuenta ha sido creada. Ahora inicia sesión." })
      setActiveTab("login")
      setRegStep(1)
      setFullName("")
      setRegisterEmail("")
      setPhoneNumber("")
      setWhatsappNumber("")
      setSameAsPhone(false)
      setRegisterPassword("")
      setConfirmPassword("")
    } catch (error) {
      sileo.error({ title: "Error al crear cuenta", description: error instanceof Error ? error.message : "Ocurrió un error inesperado." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1A1A2E] rounded-xl p-10 glass-panel shadow-2xl">
      {/* Login Form */}
      {activeTab === "login" && (
        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div className="space-y-6">
            <FormField
              label="Correo Electrónico"
              icon={Mail}
              type="email"
              placeholder="tu@email.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              error={loginEmailError}
            />
            <FormField
              label="Contraseña"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              valid={loginPasswordValid}
              rightAction={
                <Link href="#" className="text-xs font-semibold tracking-wider text-secondary hover:underline">
                  Olvidaste tu contraseña?
                </Link>
              }
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          </div>
          <Button type="submit" className="w-full py-4 text-xl font-semibold" loading={loading}>
            Iniciar sesión
          </Button>
          <div className="text-center pt-4">
            <p className="text-base text-muted-foreground">
              No tienes cuenta?{" "}
              <button type="button" onClick={() => { setActiveTab("register"); setRegStep(1) }} className="text-primary font-bold hover:underline">
                Regístrate
              </button>
            </p>
          </div>
        </form>
      )}

      {/* Register Multi-Step Form */}
      {activeTab === "register" && (
        <div className="space-y-5">
          <StepIndicator currentStep={regStep} totalSteps={3} />

          {/* Step 1: Datos Personales */}
          {regStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Datos Personales</h3>
                <p className="text-[11px] text-on-surface-variant">Cuéntanos sobre ti</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className="text-[11px] font-medium text-on-surface-variant">Nombre completo *</label>
                  <div className="relative">
                    <Icon name="account" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                      id="reg-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                  {fullName && !fullNameValid && <p className="text-[10px] text-error">Mínimo 3 caracteres</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="text-[11px] font-medium text-on-surface-variant">Correo electrónico *</label>
                  <div className="relative">
                    <Icon name="email" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                      id="reg-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                  {registerEmail && registerEmailError && <p className="text-[10px] text-error">{registerEmailError}</p>}
                </div>
              </div>
              <Button
                type="button"
                className="w-full py-3 text-sm font-semibold"
                disabled={!canNextStep1}
                onClick={() => setRegStep(2)}
              >
                Siguiente
              </Button>
            </div>
          )}

          {/* Step 2: Contacto */}
          {regStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Datos de Contacto</h3>
                <p className="text-[11px] text-on-surface-variant">Para poder comunicarnos contigo</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-on-surface-variant">Teléfono *</label>
                  <div className="flex gap-2">
                    <div className="relative w-32 shrink-0">
                      <select
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                        <Icon name="unfold-more" className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
                    </div>
                    <div className="relative flex-1">
                      <Icon name="phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="12345678"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  {phoneNumber && !phoneValid && <p className="text-[10px] text-error">Mínimo 6 dígitos</p>}
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="same-as-phone"
                    checked={sameAsPhone}
                    onChange={(e) => {
                      setSameAsPhone(e.target.checked)
                      if (e.target.checked) setWhatsappNumber("")
                    }}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <label htmlFor="same-as-phone" className="text-xs text-on-surface-variant">WhatsApp es el mismo número</label>
                </div>

                {!sameAsPhone && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="text-[11px] font-medium text-on-surface-variant">WhatsApp</label>
                    <div className="flex gap-2">
                      <div className="relative w-32 shrink-0">
                        <select
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          className="w-full px-3 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <Icon name="unfold-more" className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <Icon name="chat" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                        <input
                          type="tel"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                          placeholder="12345678"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>
                    {whatsappNumber && !whatsappValid && <p className="text-[10px] text-error">Mínimo 6 dígitos</p>}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="flex-1 py-3 text-sm font-semibold" onClick={() => setRegStep(1)}>
                  Atrás
                </Button>
                <Button type="button" className="flex-1 py-3 text-sm font-semibold" disabled={!canNextStep2} onClick={() => setRegStep(3)}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contraseña */}
          {regStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">Seguridad</h3>
                <p className="text-[11px] text-on-surface-variant">Crea una contraseña segura</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="text-[11px] font-medium text-on-surface-variant">Contraseña *</label>
                  <div className="relative">
                    <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerPassword && !registerPasswordValid && <p className="text-[10px] text-error">Mínimo 8 caracteres</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="reg-confirm" className="text-[11px] font-medium text-on-surface-variant">Confirmar Contraseña *</label>
                  <div className="relative">
                    <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
                    <input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-white/5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && !confirmPasswordValid && <p className="text-[10px] text-error">Las contraseñas no coinciden</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="flex-1 py-3 text-sm font-semibold" onClick={() => setRegStep(2)}>
                  Atrás
                </Button>
                <Button type="button" className="flex-1 py-3 text-sm font-semibold" disabled={!canSubmitStep3} loading={loading} onClick={handleRegisterSubmit}>
                  Crear Cuenta
                </Button>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-base text-muted-foreground">
              Ya tienes cuenta?{" "}
              <button type="button" onClick={() => setActiveTab("login")} className="text-primary font-bold hover:underline">
                Entrar
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <PulseIndicator label="Entrega instantánea 24/7 disponible" />
      </div>
    </div>
  )
}
