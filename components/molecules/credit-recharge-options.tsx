"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/atoms/button"
import { Icon } from "@/components/atoms/icon"

const WHATSAPP_NUMBER = "5350000000"
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola! Me interesa recargar créditos en mi cuenta de StreamHub. ¿Podrian ayudarme?"
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const QVAPAY_URL = "https://qvapay.com"

export function CreditRechargeOptions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GlassCard className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center">
          <Icon name="whatsapp" className="text-[32px] text-[#25D366]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Contactar Comercial</h3>
          <p className="text-sm text-[var(--on-surface-variant)] max-w-xs">
            Habla directamente con nuestro equipo por WhatsApp para recargar créditos de forma manual.
          </p>
        </div>
        <Button
          variant="whatsapp"
          className="rounded-full"
          onClick={() => window.open(WHATSAPP_URL, "_blank")}
        >
          <Icon name="whatsapp" className="text-[18px]" />
          <span>Abrir WhatsApp</span>
        </Button>
      </GlassCard>

      <GlassCard className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
          <Icon name="qrcode-scan" className="text-[32px] text-purple-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Recargar con QvaPay</h3>
          <p className="text-sm text-[var(--on-surface-variant)] max-w-xs">
            Recarga instantánea usando QvaPay. Los créditos se acreditan automáticamente.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-full text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
          onClick={() => window.open(QVAPAY_URL, "_blank")}
        >
          <Icon name="qrcode-scan" className="text-[18px]" />
          <span>Abrir QvaPay</span>
        </Button>
      </GlassCard>
    </div>
  )
}
