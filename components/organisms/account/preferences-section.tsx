'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useSession } from '@/lib/session-context'
import { signOut } from '@/lib/api/auth'
import { sileo } from 'sileo'

export function PreferencesSection() {
  const router = useRouter()
  const { clearSession } = useSession()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      clearSession()
      sileo.success({ title: 'Sesion cerrada', description: 'Has cerrado sesion correctamente.' })
      router.push('/login')
    } catch (error) {
      sileo.error({
        title: 'Error al cerrar sesion',
        description: error instanceof Error ? error.message : 'Ocurrio un error inesperado.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4" id="configuracion">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className="material-symbols-outlined text-[var(--outline)]" data-icon="manage_accounts">
          manage_accounts
        </span>
        Detalles de la cuenta
      </h2>
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)] mb-2">
                Nombre Completo
              </label>
              <input
                className="w-full bg-[var(--surface-container-low)] border-b border-white/10 focus:border-secondary text-sm px-3 py-2"
                type="text"
                defaultValue="Jorge Garcia"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)] mb-2">
                Correo Electronico
              </label>
              <input
                className="w-full bg-[var(--surface-container-low)] border-b border-white/10 focus:border-secondary text-sm px-3 py-2"
                type="email"
                defaultValue="jorge.g@email.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)] mb-2">
                WhatsApp (Opcional)
              </label>
              <input
                className="w-full bg-[var(--surface-container-low)] border-b border-white/10 focus:border-secondary text-sm px-3 py-2"
                type="tel"
                defaultValue="+53 5263 7485"
              />
            </div>
            <Button className="rounded-2xl px-6">Guardar cambios</Button>
          </div>
          <div className="space-y-6 border-t md:border-t-0 md:border-l border-white/5 md:pl-6">
            <h3 className="text-lg font-semibold">Preferencias de notificacion</h3>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium">Vencimiento de servicios</p>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Recibe avisos 3 dias antes de expirar.
                </p>
              </div>
              <div className="w-12 h-6 rounded-full bg-primary relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium">Nuevos lanzamientos</p>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Notificaciones sobre nuevos servicios en el catalogo.
                </p>
              </div>
              <div className="w-12 h-6 rounded-full bg-[var(--surface-container-high)] border border-white/20 relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-[var(--on-surface-variant)] rounded-full" />
              </div>
            </div>
            <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold mb-2">
                Consejo de seguridad
              </p>
              <p className="text-sm text-[var(--on-surface)]">
                Nunca compartas tus credenciales de acceso con personas fuera de tu hogar para evitar bloqueos de cuenta.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
      <Button
        className="rounded-2xl px-6 bg-red-600 hover:bg-red-500 text-white"
        onClick={handleSignOut}
        disabled={loading}
      >
        {loading ? 'Cerrando sesion...' : 'Cerrar sesion'}
      </Button>
    </section>
  )
}
