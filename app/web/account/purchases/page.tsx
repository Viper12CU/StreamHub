import { PurchaseHistorySection } from '@/components/organisms/account/purchase-history-section'
import { PurchaseSuggestions } from '@/components/organisms/account/purchase-suggestions'

export const metadata = {
  title: 'Mis Compras | StreamHub Cuba',
  description: 'Historial de compras en StreamHub Cuba.',
}

export default function AccountPurchasesPage() {
  return (
    <>
      <PurchaseHistorySection />
      <PurchaseSuggestions />
    </>
  )
}
