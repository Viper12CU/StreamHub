import { AccountHero } from '@/components/organisms/account/account-hero'
import { ActiveServicesSection } from '@/components/organisms/account/active-services-section'
import { PurchaseHistorySection } from '@/components/organisms/account/purchase-history-section'
import { PurchaseSuggestions } from '@/components/organisms/account/purchase-suggestions'

export default function AccountPage() {
  return (
    <>
      <AccountHero />
      <ActiveServicesSection />
      <PurchaseHistorySection />
      <PurchaseSuggestions />
    </>
  )
}
