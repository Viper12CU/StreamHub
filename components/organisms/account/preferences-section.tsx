'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Icon } from '@/components/atoms/icon'
import { useSession } from '@/lib/session-context'
import { signOut } from '@/lib/api/auth'
import { getMyProfile, updateMyProfile } from '@/lib/api/account'
import { sileo } from 'sileo'

export function PreferencesSection() {
  const router = useRouter()
  const { clearSession } = useSession()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setName(p.name)
        setEmail(p.email)
        setWhatsapp(p.whatsapp || '')
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateMyProfile({ name, whatsapp: whatsapp || null })
      sileo.success({ title: 'Perfil actualizado', description: 'Tus cambios se guardaron correctamente.' })
    } catch (error) {
      sileo.error({ title: 'Error', description: error instanceof Error ? error.message : 'No se pudieron guardar los cambios.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      clearSession()
      sileo.success({ title: 'Sesion cerrada', description: 'Has cerrado sesion correctamente.' })
      router.push('/web/login')
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
        <Icon name="account-cog" className="text-[var(--outline)]" />
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loadingProfile}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)] mb-2">
                Correo Electronico
              </label>
              <input
                className="w-full bg-[var(--surface-container-low)] border-b border-white/10 text-sm px-3 py-2 opacity-60"
                type="email"
                value={email}
                readOnly
              />
              <p className="text-[10px] text-[var(--on-surface-variant)] mt-1">El email no se puede cambiar.</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)] mb-2">
                WhatsApp (Opcional)
              </label>
              <input
                className="w-full bg-[var(--surface-container-low)] border-b border-white/10 focus:border-secondary text-sm px-3 py-2"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                disabled={loadingProfile}
              />
            </div>
            <Button className="rounded-2xl px-6" onClick={handleSave} disabled={saving || loadingProfile}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
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
