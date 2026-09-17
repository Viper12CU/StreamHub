import type { Metadata } from "next"
import { CreditHeroCard } from "@/components/molecules/credit-hero-card"
import { CreditTransactionTable } from "@/components/molecules/credit-transaction-table"
import { CreditRechargeOptions } from "@/components/molecules/credit-recharge-options"

export const metadata: Metadata = {
  title: "Mis Créditos",
}

export default function AccountCreditsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Mis Créditos
        </h1>
        <p className="text-[var(--on-surface-variant)] text-sm mt-1">
          Gestiona tu saldo, revisa tu historial y recarga créditos.
        </p>
      </div>

      <CreditHeroCard />

      <div className="space-y-4 mt-12">
        <h2 className="text-lg font-bold">Cómo Recargar</h2>
        <CreditRechargeOptions />
      </div>

      <CreditTransactionTable />
    </div>
  )
}
