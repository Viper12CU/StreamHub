import type { Metadata } from "next"
import { CreditHeroCard } from "@/components/molecules/credit-hero-card"
import { CreditTransactionTable } from "@/components/molecules/credit-transaction-table"
import { CreditRechargeOptions } from "@/components/molecules/credit-recharge-options"
import { CreditExchangeInfo } from "@/components/molecules/credit-exchange-info"
import { getUsdCupRate } from "@/lib/api/exchange-rate"

export const metadata: Metadata = {
  title: "Mis Créditos",
}

export default async function AccountCreditsPage() {
  const exchangeRate = await getUsdCupRate()

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
      <div className="h-4"></div>
      <CreditExchangeInfo exchangeRate={exchangeRate} />

      <div className="space-y-4 mt-12">
        <h2 className="text-lg font-bold">Cómo Recargar</h2>
        <CreditRechargeOptions />
      </div>

      <CreditTransactionTable />
    </div>
  )
}
